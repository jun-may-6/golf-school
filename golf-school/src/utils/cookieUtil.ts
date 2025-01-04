export class CookieBuilder {
  key:string;
  value:string;
  options:string;
  constructor(){
    this.key = "";
    this.value = "";
    this.options = "";
  }
  setKey(key:string){
    this.key = key;
    return this;
  }
  setValue(value:string){
    this.value = value;
    return this;
  }
  
}