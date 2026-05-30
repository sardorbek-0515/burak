 /* Project Standards;
   - Logging standards 
   -Naming standards:
      function, method, variable => CAMEL
      class => PASCAL
      folder => KEBAB
      css => SNAKE
  - Error handling





 */         
                   
                   
                   
                   
                   
                   
                   
                   
                   
                   
                   
                   //Mitask------L
function reverseSentence(sentence: string): string {
  return sentence
    .split(" ") 
    .map(word => word.split("").reverse().join("")) 
    .join(" "); 
}

console.log(reverseSentence("we like coding!"));




                   /////////Mitask------M
//M-TASK
// Shunday function yozing, u raqamlardan tashkil topgan array qabul qilsin va array ichidagi har bir raqam uchun raqamni ozi va hamda osha raqamni kvadratidan tashkil topgan object hosil qilib, hosil bolgan objectlarni array ichida qaytarsin. MASALAN: getSquareNumbers([1, 2, 3]) return [{number: 1, square: 1}, {number: 2, square: 4}, {number: 3, square: 9}].


function getSquareNumbers(arr: number[]): { number: number; square: number }[] {
  return arr.map((num: number) => ({
    number: num,
    square: num * num
  }));
}


console.log(getSquareNumbers([1, 2, 3]));


//////////////////////////Mitask------N
//N-TASK
// Shunday function yozing, u string qabul qilsin va string palindrom yani togri oqilganda ham, orqasidan oqilganda ham bir hil oqiladigan soz ekanligini aniqlab boolean qiymat qaytarsin. MASALAN: palindromCheck("dad") return true; palindromCheck("son") return false.

function palindromCheck(str: string): boolean {
    return str === str.split("").reverse().join("");
}

console.log(palindromCheck("dad"));   // true
console.log(palindromCheck("son"));   // false


