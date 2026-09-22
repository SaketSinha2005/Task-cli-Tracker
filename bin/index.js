#!/usr/bin/env node

const fs = require("node:fs");
var {argv} = require('node:process');

argv = Object.entries(argv).slice(2).map(entry => entry[1]);
if (argv[0] === "add") {
    process_file(argv[0], undefined, argv[1]);
}
else if (argv[0] === "update") {
    process_file(argv[0], argv[1], argv[2]);
}
else if (argv[0] === "delete") {
    process_file(argv[0], argv[1], undefined);
}
else if(argv[0] === "mark-in-progress" || argv[0] === "mark-done"){
    process_file(argv[0], argv[1], undefined);
}
else if(argv[0] === "list"){
    process_file(argv[0], argv[1], undefined);
}
else {
    console.log(`Unknown command: ${argv[0]}`);
}


function get_id(data) {
    if (data.length === 0) return 1;
    return data[data.length - 1].id + 1;
}

function process_file(val, id, msg){
    const filePath = "D:\\backend_dev\\data.json";

    if(!fs.existsSync(filePath)){
        fs.writeFileSync(filePath, "[]");
    }

    let filedata = fs.readFileSync(filePath, 'utf8');
    let data = JSON.parse(filedata);
    const datetime = new Date(); 

    if(val === `add`){
        data.push({
            id: get_id(data),
            description: msg,
            status: "todo",
            createdAt: datetime,
            updatedAt: datetime
        });

        fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
            if(err) throw err;
            else console.log(`Entry added with id: ${get_id(data)-1}`);
        });
    }

    else if(val === `update`){
        let sub_data = data.find(task => task.id === Number(id));    
        if(sub_data){
            sub_data.description = msg;
            sub_data.updatedAt = datetime; 
            fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
                if(err) throw err;
                console.log(`Task with id ${id} updated`);
            })
        }
        else{
            console.log(`Task with id ${id} not found`);
            return;
        }
    }

    else if(val === `delete`){
        let sub_data = data.find(task => task.id === Number(id));
        if(sub_data){
            data = data.filter(task => task.id != Number(id));
            fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
                if(err) throw err;
                console.log("Data deleted");
            })
        }
        else{
            console.log(`Task with id ${id} not found`);
            return;
        }
    }
    else if(val === `mark-in-progress` || val === 'mark-done'){
        let sub_data = data.find(task => task.id === Number(id));
        if(sub_data){
            if(val === `mark-in-progress`) sub_data.status = "in-progress";
            else if(val === `mark-done`) sub_data.status = "done";
            sub_data.updatedAt = datetime;
            fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
                if(err) throw err;
            })
        }
        else{
            console.log(`Task with id ${id} not found`);
            return
        }
    }
    else if(val === `list`){
    let filtered_data;

    if(id === undefined){
        filtered_data = data;
    }
    else if(id === "done" || id === "todo" || id === "in-progress"){
        filtered_data = data.filter(task => task.status === id);
    }
    else{
        console.log(`Invalid status: ${id}`);
        return;
    }

    if(filtered_data.length === 0){
        console.log("No tasks found");
        return;
    }

    console.log(filtered_data);
}
}