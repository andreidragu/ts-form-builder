module Pages {
    export class BasePage {
        protected mainContainer: HTMLElement;
        protected loaderElem: HTMLElement;

        constructor() {
            this.initVars();
        }

        /**
         * Initialize the variables.
         */
        protected initVars(): void {
            this.mainContainer = document.getElementById('mainContainer');
            this.loaderElem = (<HTMLElement>document.getElementsByClassName('loader').item(0));
        }
    }
}