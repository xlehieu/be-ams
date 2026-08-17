import { ObjectLiteral, Repository } from 'typeorm';

type NormalOperator = 'like' | 'ilike' | 'gt' | 'gte' | 'lt' | 'lte' | 'eq';
type ArrayOperator = 'overlap' | 'contains' | 'is_contained_by';
type CustomOperator = 'compare_date';
type Operator =
  | NormalOperator
  | ArrayOperator
  | CustomOperator
  | 'any'
  | 'between'
  | 'not_between'
  | 'null_check';

export type QueryBuilderConfigItem = {
  key: string | string[];
  value: any;
  paramName: string;
  operatorCf: Operator;
};
type QueryBuilderConfig = {
  alias: string;
  queryList: QueryBuilderConfigItem[];
};

const NORMAL_OPERATOR_MAP: Record<NormalOperator, string> = {
  like: 'LIKE',
  ilike: 'ILIKE',
  eq: '=',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<=',
};

const ARRAY_OPERATOR_MAP: Record<ArrayOperator, string> = {
  overlap: '&&', //có ít nhất 1 phần tử chung
  contains: '@>', //mảng bên trái chứa all phần tử mảng bên phải
  is_contained_by: '<@', // mảng bên phải chứa tất cả mảng bên phải
};

export const buildAndWhereQueryBuilder = <
  T extends ObjectLiteral = ObjectLiteral,
>(
  repository: Repository<T>,
  config: QueryBuilderConfig,
) => {
  const { alias, queryList } = config;
  const qb = repository.createQueryBuilder(alias);

  queryList.forEach((query) => {
    // phải có value

    const { key, operatorCf } = query;
    if ((operatorCf === 'ilike' || operatorCf === 'like') && query.value) {
      // nếu là array hoặc object => throw lỗi luôn
      if (typeof query.value === 'object')
        throw new Error(
          `Lỗi buildAndWhereQueryBuilder ${alias} ${key} like || ilike`,
        );
      const operator = NORMAL_OPERATOR_MAP[operatorCf];
      // nếu key là arr thì dùng or => ex: keyword
      if (Array.isArray(key)) {
        const where = key
          .map(
            (itemKey) => `${alias}.${itemKey} ${operator} :${query.paramName}`,
          )
          .join(' OR ');
        qb.andWhere(where, { [query.paramName]: `%${query.value}%` });
      } else {
        qb.andWhere(`${alias}.${key} ${operator} :${query.paramName}`, {
          [query.paramName]: `%${query.value}%`,
        });
      }
    } else if (
      ['gt', 'gte', 'lt', 'lte', 'eq'].includes(operatorCf) &&
      query.value
    ) {
      const operator = NORMAL_OPERATOR_MAP[operatorCf as NormalOperator];
      if (typeof query.value === 'object')
        throw new Error(
          `Lỗi buildAndWhereQueryBuilder ${alias} ${key} gt || gte || lt || lte || eq`,
        );
      if (Array.isArray(key)) {
        const where = key
          .map(
            (itemKey) => `${alias}.${itemKey} ${operator} :${query.paramName}`,
          )
          .join(' OR ');
        qb.andWhere(where, { [query.paramName]: query.value });
      } else {
        qb.andWhere(`${alias}.${key} ${operator} :${query.paramName}`, {
          [query.paramName]: query.value,
        });
      }
    } else if (
      (operatorCf === 'between' || operatorCf === 'not_between') &&
      query.value
    ) {
      // value bắt buộc là mảng [from, to]
      if (!Array.isArray(query.value) || query.value.length !== 2) {
        throw new Error(
          `Lỗi buildAndWhereQueryBuilder ${alias} ${key} ${operatorCf}: value phải là mảng [from, to]`,
        );
      }
      const [from, to] = query.value;
      const operator = operatorCf === 'between' ? 'BETWEEN' : 'NOT BETWEEN';
      const fromParam = `${query.paramName}_from`;
      const toParam = `${query.paramName}_to`;

      if (Array.isArray(key)) {
        const where = key
          .map(
            (itemKey) =>
              // 'asset.purchase_date BETWEEN :purchase_from_date AND :purchase_to_date'
              `${alias}.${itemKey} ${operator} :${fromParam} AND :${toParam}`,
          )
          .join(' OR ');
        qb.andWhere(where, { [fromParam]: from, [toParam]: to });
      } else {
        qb.andWhere(
          `${alias}.${key} ${operator} :${fromParam} AND :${toParam}`,
          { [fromParam]: from, [toParam]: to },
        );
      }
    } else if (
      operatorCf === 'null_check' &&
      query.value !== null &&
      query.value !== undefined
    ) {
      // nếu là undefined || null thì bỏ qua
      const operator = query.value ? 'IS NULL' : 'IS NOT NULL';
      if (Array.isArray(key)) {
        const where = key
          .map((itemKey) => `${alias}.${itemKey} ${operator}`)
          .join(' OR ');
        qb.andWhere(where);
      } else {
        qb.andWhere(`${alias}.${key} ${operator}`);
      }
    } else if (operatorCf === 'any' && query.value) {
      // :tag = ANY(asset.tags) => key phải là 1 cột array duy nhất, value là 1 giá trị cần check
      if (Array.isArray(key)) {
        throw new Error(
          `Lỗi buildAndWhereQueryBuilder ${alias} ${key} any: key phải là 1 cột duy nhất, không phải mảng`,
        );
      } else if (typeof query.value === 'object') {
        throw new Error(
          `Lỗi buildAndWhereQueryBuilder ${alias} ${key} any: value phải là chuỗi hoặc number`,
        );
      }
      // thằng any param phải ở bên phải
      qb.andWhere(`:${query.paramName} = ANY(${alias}.${key})`, {
        [query.paramName]: query.value,
      });
    } else if (
      (operatorCf === 'overlap' ||
        operatorCf === 'contains' ||
        operatorCf === 'is_contained_by') &&
      query.value
    ) {
      // key phải là 1 cột array duy nhất, value phải là mảng
      if (Array.isArray(key)) {
        throw new Error(
          `Lỗi buildAndWhereQueryBuilder ${alias} ${key} ${operatorCf}: key phải là 1 cột duy nhất, không phải mảng`,
        );
      }
      if (!Array.isArray(query.value)) {
        throw new Error(
          `Lỗi buildAndWhereQueryBuilder ${alias} ${key} ${operatorCf}: value phải là mảng`,
        );
      }
      const operator = ARRAY_OPERATOR_MAP[operatorCf];
      qb.andWhere(`${alias}.${key} ${operator} :${query.paramName}`, {
        [query.paramName]: query.value,
      });
    } else if (
      operatorCf === 'compare_date' &&
      query?.value?.every((item: any) => item !== undefined && item !== null) &&
      query.value
    ) {
      if (!Array.isArray(query.value)) {
        throw new Error(
          `Lỗi buildAndWhereQueryBuilder ${alias} ${key} ${operatorCf}: value phải là mảng []`,
        );
      }
      const [from, to] = query.value;
      const fromParam = `${query.paramName}_from`;
      const toParam = `${query.paramName}_to`;

      if (Array.isArray(key)) {
        if (query.value.length === 2) {
          const where = key
            .map(
              (itemKey) =>
                `${alias}.${itemKey} BETWEEN :${fromParam} AND :${toParam}`,
            )
            .join(' OR ');
          qb.andWhere(where, { [fromParam]: from, [toParam]: to });
        } else if (from) {
          const where = key
            .map((itemKey) => `${alias}.${itemKey} >= :${fromParam}`)
            .join(' OR ');
          qb.andWhere(where, { [fromParam]: from });
        } else {
          const where = key
            .map((itemKey) => `${alias}.${itemKey} <= :${to}`)
            .join(' OR ');
          qb.andWhere(where, { [toParam]: to });
        }
      } else {
        if (query.value.length === 2) {
          const where = `${alias}.${key} BETWEEN :${fromParam} AND :${toParam}`;
          qb.andWhere(where, { [fromParam]: from, [toParam]: to });
        } else if (from) {
          const where = `${alias}.${key} >= :${fromParam}`;
          qb.andWhere(where, { [fromParam]: from });
        } else {
          const where = `${alias}.${key} <= :${to}`;
          qb.andWhere(where, { [toParam]: to });
        }
      }
    }
  });

  return qb;
};
