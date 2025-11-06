import never_jscore

js_code = """
function add(a, b) {
  return a + b;
}
function sumArray(arr) {
  let s = 0;
  for (let i = 0; i < arr.length; i++) s += arr[i];
  return s;
}
Worker
"""

ctx = never_jscore.Context()

ctx.eval(js_code)




