export interface Subject {
    Id: number;
    Name: string;
}

export interface Question {
    Id: number;
    Question: string;
    Subject: Subject;
    Answer: string;
}

export interface QuestionPost {
    Text: string;
    Primary: boolean;
    SubjectId: number;
    AskedBy: number;
    AnswerId?: number;
}