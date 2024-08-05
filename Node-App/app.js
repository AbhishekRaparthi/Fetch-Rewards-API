const express=require('express');
const { v4: uuidv4 } = require('uuid');

const app=express();
const PORT=8088;

//using a map to store ids and points for fast retrevals
const pointsMap=new Map();

app.use(express.json());
app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`);
})

app.post('/receipts/process',(req,res)=>{
    //passes the receipts to method to calculate rewards
    //returns the uuid;
    data=req.body;
    var id = convertDataToReceipt(data);
    res.status(200).send({
        'id':id
    })
})

app.get('/',(req,res)=>{
    res.status(200).send({
        "Message from server":" Servre is running , hit the /receipts/process and /receipts/:id/points endpoints to test"
    })
})

app.get('/receipts/:id/points',(req,res)=>{
    //gets the id from the parameters 
    // gets the points from the map and returns the json object
    let id=req.params.id;
    let points=pointsMap.get(id);
    res.status(200).send({
        "points" : points
    })
})

function convertDataToReceipt(data){
    var points=0;
    //creating a unique id for the reciept and storing it in a map for easy retrival
    let id=uuidv4();
    while(pointsMap.has(id)){
        //using while to make sure no duplicate id's are generated
        id=uuidv4();
    }
    points+=getPointsforName(data.retailer);
    points+=getPointsForTotal(data.total);
    points+=getPointsforItems(data.items);
    points+=getPointsforDateAndTime(data.purchaseDate,data.purchaseTime);

    pointsMap.set(id,points);
    return id;
}
function getPointsforDateAndTime(date,time){
    let pt=0;
    //checking for 6 pts if day purchase date is odd and
    let dates=date.split('-');
    if(parseInt(dates[2])%2==1) pt+=6;

    let timeString = "13:01";

    // Create a Date object for today at the specified time
    let now = new Date();
    let timeParts = time.split(':'); // Split into hour and minute

    // Set the hours and minutes
    now.setHours(parseInt(timeParts[0], 10)); // Convert hour to integer
    now.setMinutes(parseInt(timeParts[1], 10)); // Convert minute to integer
    now.setSeconds(0); // Set seconds to 0
    now.setMilliseconds(0); // Set milliseconds to 0

    const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0, 0); // 2:00 PM
    const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 0, 0);   // 4:00 PM

    // Check if the current time is after 2:00 PM and before 4:00 PM
    if (now >= startTime && now <= endTime) {
        pt+=10;
    }

    return pt;
}
function getPointsforItems(items){
    let pt=0;
    //awards 5 points for every pair of items
    pt+=Math.floor(items.length/2)*5;
    //trimmed length check
    for(let i=0;i<items.length;i++){
        let trimmedDsc=items[i].shortDescription.trim();
        if(trimmedDsc.length%3==0){
            //if trimmed length is multiple of 3 , multiplying and rouding up the values
            pt+=Math.ceil( items[i].price *0.2);
        }
    } 
    return pt;
}
function getPointsForTotal(total){
    //check if it round dollar amount with no cents +50
    //check if multiple of 0.25 +25
    let pt=0;
    if(total%0.25==0) pt+=25;
    total=total*100;
    if(total%10==0){
        total=total/10;
        if(total%10==0) pt+=50;
    }
    return pt;
}
function getPointsforName(name){
    //iterates over name and counts the number of alphanumeric charecters using ascii values
    let pt=0;
    for(let i=0;i<name.length;i++){
        let c=name.charCodeAt(i);
        if((c>=48 && c<=57) || (c>=65 && c<=90) || (c>=97 && c<=122)){
            pt++;
        }
    }
    return pt;
}
