var txt;
var enteredName = window.prompt('Please enter your name', 'Your name is here');
if (enteredName == null || enteredName == "")
{
	txt = "Welcome Stranger!";
} else {
	txt = "Welcome" + " " + enteredName + "!";	
}
	document.getElementById("hello").innerHTML = txt;
//Prompt for Name
