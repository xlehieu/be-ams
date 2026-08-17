export class ESError extends Error {
  constructor(message: string) {
    super(message);
    this.name = ESError.name; // name extends từ Error là Error => gán lại
    Object.setPrototypeOf(this, ESError.prototype); // dùng thằng này để có thể dùng err instanceof ESError
  }
}
