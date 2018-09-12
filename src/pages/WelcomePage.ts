/// <reference path='../utils/Utils.ts' />

module Pages {
    import HttpUtils = Utils.HttpUtils;

    export class WelcomePage {
        constructor() {
            HttpUtils.fetchInternal('./welcome.html')
                .then((text: string) => {
                    document.getElementById('mainContainer').innerHTML = text;
                });
        }
    }
}