const MSICreator = require('electron-wix-msi');
 
async function self(){

 
// Step 1: Instantiate the MSICreator
const msiCreator = new MSICreator({
  appDirectory: '/path/to/built/app',
  description: 'My amazing Kitten simulator',
  exe: 'kittens',
  name: 'Kittens',
  manufacturer: 'Kitten Technologies',
  version: '1.1.2',
  outputDirectory: '/path/to/output/folder'
});
 
// Step 2: Create a .wxs template file
await msiCreator.create();
 
// Step 3: Compile the template to a .msi file
await msiCreator.compile();

}

self();