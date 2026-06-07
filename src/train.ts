 /* Project Standards;

   - Logging standards 
   -Naming standards:
      function, method, variable => CAMEL
      class => PASCAL
      folder, file => KEBAB
      css => SNAKE                        button_style
  - Error handling
 */         


  /** Bruakda traditional, rest dan use qilamiz*  
   
   (1) Traditional Api--  Har bir funksiyaga alohida endpoint (URL) bo‘ladi.
   /users → foydalanuvchilar ro‘yxati 
  /users/1 → bitta foydalanuvchi

(2) Rest Api Traditional API’ning rivojlangan ko‘rinishi.

HTTP metodlari ishlatiladi:

GET → ma’lumot olish

POST → yangi ma’lumot qo‘shish

PUT/PATCH → ma’lumotni yangilash

DELETE → o‘chirish

JSON formatida javob qaytaradi.


  (3)  GraphQL Api -  zamonaviy, moslashuvchan, faqat kerakli ma’lumotni qaytaradi.
   ... 
   */
                   
    /*
     1)Traditional Frontend Development (FD) => SRR (admin) => EJS
     2) Modern Frontend Development (FD) => SPA (User' applacation) => REACT

    */               
                   
      /**
       request join 
       selfdestroy

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


/////////////////////// Mit ask---- O
//O-TASK
//Shunday function yozing, u har xil valuelardan iborat array qabul qilsin va array ichidagi sonlar yigindisini hisoblab chiqqan javobni qaytarsin. MASALAN: calculateSumOfNumbers([10, "10", {son: 10}, true, 35]) return 45.

function calculateSumOfNumbers(arr: any[]): number {
  let sum = 0;

  for (const item of arr) {
    if (typeof item === "number") {
      sum += item;
    }
  }

  return sum;
}

console.log(calculateSumOfNumbers([10, "10", {son: 10},  true, 35])); //


///////////////
/* P-TASK
Shunday function yozing, u object qabul qilsin
va arrayni object arrayga otkazib arrayni qaytarsin.
MASALAN: objectToArray({a: 10, b: 20}) return [["a", 10], ["b", 20]].
*/
function objectToArray(params: { [key: string]: any }) {
  let result = [];
  for (let key in params) {
    result.push([key, params[key]]);
  }
  return result;
}
const result1 = objectToArray({ a: 10, b: 20 });
console.log(result1);
const result2 = objectToArray({ CC: 82, HM: 993 });
console.log(result2);

////////////////
// Q-TASK
//Q-TASKShunday function yozing, u 2 ta parametrgga ega bolib birinchisi object, ikkinchisi string. Agar string parametr objectni propertysi bolsa true bolmasa false qaytarsin. MASALAN: hasProperty({name: "BMW", model: "M3"}, "model") return true; hasProperty({name: "BMW", model: "M3"}, "year") return false.
function hasProperty(obj: object, key: string): boolean {
    return key in obj;
}

console.log(hasProperty({name: "BMW", model: "M3"}, "model")); // true
console.log(hasProperty({name: "BMW", model: "M3"}, "year"));  // false


///////////// /R-TASK

//R-TASK

//Shunday function yozing, u string parametrga ega bolsin. String "1+2" holatda pass qilinganda string ichidagi sonlar yigindisini number holatda qaytarsin. MASALAN: calculate("1+3") return 4.

function calculate(expression: string): number {
  const numbers = expression.split('+');
  return numbers.reduce((sum, num) => sum + Number(num), 0);
}

console.log(calculate("1+3"));   // Natija: 4

