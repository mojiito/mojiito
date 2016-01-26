export class Mojito {
  constructor () {
    console.log('Mojito init!');
  }
  
  upperCaseTest (x: string) {
    return x.toUpperCase();
  }
}
new Mojito();