let color = '000000' 
const front = "<font color=\""
const back = "\">color </font>"

for (i=0; i<100; i++) {
    color = Math.floor(Math.random()*16777216).toString(16)
    document.write(front + color + back)
}
