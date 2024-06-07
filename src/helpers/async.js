export function delay(delay) {
  let timeoutId;  
  const promise = new Promise((resolve) => {
    const clear = function() {
      resolve(clearTimeout(timeoutId));
    }
    timeoutId = setTimeout(function(){
      clear();
      resolve()
    }, delay)
  });
  return promise;
}