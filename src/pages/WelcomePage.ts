module Pages {
    export class WelcomePage {
        constructor() {
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('welcome').style.display = null;
        }
    }
}