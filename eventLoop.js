// console.log("hello there")

// let start   = Date.now()
// let now     = start
// while(now-start < (8000)) {
//   now = Date.now();
// }

// console.log("I am at the end of the file")

let promise = new Promise((resolve) => {
  // Asynchronous operation
  setTimeout(() => {
      resolve("Success!");
  }, 1000);
});

promise.then((value) => {
  console.log(value); // "Success!" after 1 second
}).catch((error) => {
  console.error(error);
});

console.log("I am at the end of the file")
