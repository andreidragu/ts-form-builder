/// <reference path='../utils/HttpUtils.ts' />

module pages {
    import HttpUtils = utils.HttpUtils;

    export class WelcomePage extends BasePage {
        constructor() {
            super();
            HttpUtils.getInstance().requestInternal('./welcome.html')
                .then((text: string) => {
                    document.getElementById('mainContainer').innerHTML = text;
                });
        }
    }
}