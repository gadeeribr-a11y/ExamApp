export class Question {
    constructor(
        id,
        text,
        type,
        points,
        options = [],
        correctAnswer = ""
    ) {
        this.id = id;
        this.text = text;
        this.type = type;
        this.points = points;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }
}