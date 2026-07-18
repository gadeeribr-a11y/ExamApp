export class Exam {
  constructor(
    id,
    title,
    status,
    ownerId,
    questions = []
  ) {
    this.id = id;
    this.title = title;
    this.status = status;
    this.ownerId = ownerId;
    this.questions = questions;
  }
}