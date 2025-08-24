// Student: David Wilson - Assignment 1 (Poor Quality Code)
function sort(a) {
    for(let i=0;i<a.length;i++) {
        for(let j=0;j<a.length;j++) {
            if(a[i]<a[j]) {
                let t=a[i];a[i]=a[j];a[j]=t;
            }
        }
    }
}

let arr=[64,34,25,12,22,11,90];
sort(arr);
console.log(arr);
