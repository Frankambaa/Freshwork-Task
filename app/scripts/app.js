var client;

init();

async function init() {
  client = await app.initialized();
  client.events.on('app.activated', renderText);
}

// Used to get values from data storage
async function processArray(array) {
  // map array to promises
 var nameTable=[];

  for (var i = 1; i <= 10; i++) {

var data11=await client.db.get('repo:'+i);

console.log(data11);
var my_object={};
my_object["id"]=i;
my_object["namevalue"]=data11.name;
nameTable.push(my_object);

}
  // wait until all promises are resolved
return Promise.resolve(nameTable);

}



 async function getValue(){
 


processArray().then(
      (nameTable) => {
         if(nameTable.length>0){
        build(nameTable);
        }else{
  document.getElementById("lfiles").innerHTML="No Data Found";
 }
      }
    );

 


}


 function build(nameTable){
  var nameTable1=[];

 nameTable1=[{"id":1,"namevalue":"New One"},{"id":1,"namevalue":"New One"}];

console.log(nameTable1);

  var data = {
    columns: [{
      "key": "namevalue",
      "text": "Name",
      "position":1
    }],
    rows:nameTable
  };

  var datatable = document.getElementById('datatable-2');
  datatable.columns = data.columns;
  datatable.rows = data.rows;

  


 console.log(nameTable1);
// return nameTable;
  
}

// Render Initial View in custom app
async function renderText() {
 
  const textElement = document.getElementById('apptext');
  const contactData = await client.data.get('contact');
var btn = document.querySelector('.btn-auth');
  btn.addEventListener('click', openAuth);
var nameTable=[];
await getValue(); 
}



// Authenticate and Fetch Git hub repo
function openAuth() {

  var options = {
    headers: {
      "Authorization": 'token <%= access_token %>',
      "User-Agent": 'User Agent'
    },
     isOAuth: true
  };
  client.request.get(`https://api.github.com/orgs/freshworks-developers/repos`, options)
    .then(function (data) {
      // TODO : Add try catch block
      response = JSON.parse(data.response);
  //   console.log(response);
      showNotification('success','Github Fetch is successfully');
for (var i = response.length - 1; i >= 0; i--) {
  
client.db.set('repo:'+i, { "name": response[i].name }).then (
function(data) {
  // success operation
  console.log("added");
  // "data" value is { "Created" : true }
},
function(error) {
  // failure operation
  console.log(error)
});

}


    })
    .catch(function (error) {
      console.error("error", error);
    });

}


function to(promise, improved) {
  return promise
    .then((data) => [null, data])
    .catch((err) => {
      if (improved) {
        Object.assign(err, improved);
      }
      return [err];
    });
}

// Show notification after fetching
function showNotification(type,content){

client.interface.trigger("showNotify", {
  type: type,
  message: content
}).then(function(data) {
  console.log(data);
}).catch(function(error) {
  console.log(error);
});

}