#!/usr/bin/env node

const fs = require("node:fs");
var {argv} = require('node:process');

argv = Object.entries(argv).slice(2).map(entry => entry[1]);
// console.log(arg);
// process_file(argv[0], undefined, argv[1]);
// process_file(argv[0], argv[1], argv[2]);
process_file(argv[0], argv[1], undefined);

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
            // console.log(data);     
        }
        else{
            console.log(`Task with id ${id} not found`);
            return;
        }
    }

    else if(val === `delete`){
        let sub_data = data.find(task => delete task.id === Number(id));
        if(sub_data){
            data = data.filter(task => task.id != Number(id));
            fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
                if(err) throw err;
                console.log("Data deleted");
            })
            // console.log(data);
        }
        else{
            console.log(`Task with id ${id} not found`);
            return;
        }
    }
}