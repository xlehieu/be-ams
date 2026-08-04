import { Logger } from "@nestjs/common";

export const Compare = (property: string, comparisonProperty: string) => {
  return (target: Object, propertyKey: string) => {
    Logger.log(target);
    Logger.log(`property: ${property}, comparisonProperty: ${comparisonProperty}, target: ${target.constructor.name}, propertyKey: ${propertyKey}`);
  };
};