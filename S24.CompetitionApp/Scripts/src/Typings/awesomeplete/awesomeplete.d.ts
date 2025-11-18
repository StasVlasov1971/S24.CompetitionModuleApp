declare class Awesomplete {
    //Variables
    ul: any;
    minChars: number;
    static all: any;

    //Methods
    evaluate(): void;
    open(): void;
    close(): void;

    //Constructor
    constructor(input: any, service: any);   
}
