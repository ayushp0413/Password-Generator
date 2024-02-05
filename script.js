const inputSlider=document.querySelector("[data-slider]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const passLength=document.querySelector("[pass-length-number]");
const copiedMsg=document.querySelector("[dataCopiedMsg]");
const copyButton=document.querySelector(".copyButton");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numberCheck=document.querySelector("#number");
const symbolCheck=document.querySelector("#special");
const dataIndicator=document.querySelector("[data-indicator]");
const generateButton=document.querySelector(".generator-password");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols='~`@#$%^&*()_+=}]{[:;?.,/';
//initially 
let passward="";
let passwardLength=10;
let checkCount=0;
// uppercaseCheck.checked=true;
setIndicator("#ccc");

sliderHandler();

function sliderHandler() {
    inputSlider.value=passwardLength;
    passLength.innerText=passwardLength;
    
}

function getRndPass(min,max) { 
    return Math.floor(Math.random() *(max-min)) + min;
}
//  passward maker functions
function getRandomNumber(){
    return getRndPass(0,9);
}
function getRandomLowercase(){
    return String.fromCharCode(getRndPass(93,122));
}
function getRandomUppercase(){
    return String.fromCharCode(getRndPass(65,91));
}
function getRandomSymbol(){
    const randsymbol=getRndPass(0,symbols.length);
    return symbols.charAt(randsymbol);
}

//depending upon the strength of pass we will send color to it then it will set color to div
function setIndicator(color) {
    dataIndicator.style.backgroundColor=color;
    dataIndicator.style.boxShadow=`0 0 12px 1px ${color}`;
}

function strengthCheck() {
        let hasUpper = false;
        let hasLower = false;
        let hasNum = false;
        let hasSym = false;
        if (uppercaseCheck.checked) hasUpper = true;
        if (lowercaseCheck.checked) hasLower = true;
        if (numberCheck.checked) hasNum = true;
        if (symbolCheck.checked) hasSym = true;
      
        if (hasUpper && hasLower && (hasNum || hasSym) && passwardLength >= 8) {
          setIndicator("#0f0");
        } else if (
          (hasLower || hasUpper) &&
          (hasNum || hasSym) &&
          passwardLength >= 6
        ) {
          setIndicator("#ff0");
        } else {
          setIndicator("#f00");
        }
}
    


// copy content to clipboard

async function copyClipboard() {
    try
    {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copiedMsg.innerText="Copied";
    }catch(e)
    {
        copiedMsg.innerText="Failed";
    }
    // since this copied msg not visible after 2sec
    copiedMsg.classList.add("active");
    setTimeout(()=>{
        copiedMsg.classList.remove("active");
    },2000);
}

function checkboxStatusChange() {
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked) checkCount++;
    })

    // special condition
    if(passwardLength < checkCount) {
        passwardLength=checkCount;
        sliderHandler();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',checkboxStatusChange)
})

inputSlider.addEventListener('input',(e)=>{
    passwardLength=e.target.value;
    sliderHandler();
})

copyButton.addEventListener('click',()=>{
    if(passwordDisplay.value)
    {
        copyClipboard();
    }
})

function shufflePassword(array)
{
    //Fisher Yates Algorithim

    for(let i=array.length-1; i>0 ;i--)
    {
        const j=Math.floor(Math.random() * (i+1));
        const tmp=array[i];
        array[i]=array[j];
        array[j]=tmp;
    }
    let str="";
    array.forEach((el)=>{
        str+=el;
    });
    return str;
}

generateButton.addEventListener('click',()=>{

    if(checkCount==0) return;
    if(passwardLength < checkCount) {
        passwardLength=checkCount;
        sliderHandler();
    }

    // lets go to find the new password
    passward="";

    let funcArr=[];  //it is very intresting array : it containes all the get function which are ticked 

    if(uppercaseCheck.checked)
    {
        funcArr.push(getRandomUppercase);
    }
    if(lowercaseCheck.checked)
    {
        funcArr.push(getRandomLowercase);
    }
    if(numberCheck.checked)
    {
        funcArr.push(getRandomNumber);
    }
    if(symbolCheck.checked)
    {
        funcArr.push(getRandomSymbol);
    }

    // compulsory for password 
    for(let i=0;i<funcArr.length;i++)
    {
        passward+=funcArr[i]();
    }

    // to cover the password Length: it say we have 4 ticked checkbox and passlenght is 15 then :
    //  compulsory lenght is 4 and renaining length is 10-4=6  
    
    // remaining
    for(let i=0;i<passwardLength-funcArr.length;i++)
    {
        let randomIndex=getRndPass(0,funcArr.length);
        passward+=funcArr[randomIndex]();
    }
    // now we have password generated ,but we need to shuffle that password
    passward=shufflePassword(Array.from(passward)); // we pass array form of password 

    // update UI
    passwordDisplay.value=passward;
    strengthCheck();  // yaha se call hoga
})