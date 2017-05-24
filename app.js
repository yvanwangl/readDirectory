const Koa = require('koa');
const fs = require('mz/fs');
const path = require('path');

const app = new Koa();

console.log(typeof path.join === 'function');

(
    async (ctx, next) => {
    let dirPath = __dirname;
    let dirs = await fs.readdir(__dirname);
    let dirObj = {
        name: dirPath,
        children: []
    };
    async function getChildren(dirPath, dirs, dirObj){
        // console.log(JSON.stringify(dirPath));
        Array.from(dirs).map(dir=> {
                let filePath = path.join(dirPath, dir);
                if(dir=='node_modules'){
                    return;
                }
                if(fs.statSync(filePath).isFile()){
                    dirObj.children.push({
                        name: dir
                    });
                }else if(fs.statSync(filePath).isDirectory()){
                    let dirObjChild = {
                        name: dir,
                        children: []
                    };
                    dirObj.children.push(dirObjChild);
                    let dirsChild = fs.readdirSync(filePath);
                    // console.log(dirsChild);
                    getChildren(filePath, dirsChild, dirObjChild);
                }
            });
    }

    getChildren(__dirname, dirs, dirObj);

    console.log(JSON.stringify(dirObj));
    
})();


app.listen(3000);