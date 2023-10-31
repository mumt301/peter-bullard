function changeTable() {
    let table1=document.getElementById('table1');
    let table2=document.getElementById('table2');
    console.log(table1.hasAttribute('hidden'));
    if (table1.hasAttribute('hidden')){

        table1.removeAttribute('hidden');
        table2.setAttribute('hidden', true);

    } else {

        table2.removeAttribute('hidden');
        table1.setAttribute('hidden', true);
        
    }
}