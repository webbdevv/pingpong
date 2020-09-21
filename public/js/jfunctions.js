function Matchtype()
{
    var x = document.getElementById("MatchType").value;
        var second = document.querySelector('#Game2');
        var second_ = document.getElementById('Game2_2');
        var third = document.getElementById('Game3');
        var third_ = document.getElementById('Game3_2');
        var fourth = document.getElementById('Game4');
        var fourth_ = document.getElementById('Game4_2');
        var fifth = document.getElementById('Game5');
        var fifth_ = document.getElementById('Game5_2');
        var sixth = document.getElementById('Game6');
        var sixth_ = document.getElementById('Game6_2');
        var seventh = document.getElementById('Game7');
        var seventh_ = document.getElementById('Game7_2');
    if(x == "MatchTypeSingle")
    {
        second.setAttribute('disabled', true);
        second_.setAttribute('disabled', true);
        third.setAttribute('disabled', true);
        third_.setAttribute('disabled', true);
        fourth.setAttribute('disabled', true);
        fourth_.setAttribute('disabled', true);
        fifth.setAttribute('disabled', true);
        fifth_.setAttribute('disabled', true);
        sixth.setAttribute('disabled', true);
        sixth_.setAttribute('disabled', true);
        seventh.setAttribute('disabled', true);
        seventh_.setAttribute('disabled', true);
    }
    if(x == "MatchTypeBO3")
    {
        second.removeAttribute('disabled');
        second_.removeAttribute('disabled');
        third.removeAttribute('disabled');
        third_.removeAttribute('disabled');
        fourth.setAttribute('disabled', true);
        fourth_.setAttribute('disabled', true);
        fifth.setAttribute('disabled',  true);
        fifth_.setAttribute('disabled', true);
        sixth.setAttribute('disabled', true);
        sixth_.setAttribute('disabled', true);
        seventh.setAttribute('disabled', true);
        seventh_.setAttribute('disabled', true);
    }
    if(x == "MatchTypeBO5")
    {
        second.removeAttribute('disabled');
        second_.removeAttribute('disabled');
        third.removeAttribute('disabled');
        third_.removeAttribute('disabled');
        fourth.removeAttribute('disabled');
        fourth_.removeAttribute('disabled');
        fifth.removeAttribute('disabled');
        fifth_.removeAttribute('disabled');
        sixth.setAttribute('disabled', true);
        sixth_.setAttribute('disabled', true);
        seventh.setAttribute('disabled', true);
        seventh_.setAttribute('disabled', true);
    }
    if(x == "MatchTypeBO7")
    {
        second.removeAttribute('disabled');
        second_.removeAttribute('disabled');
        third.removeAttribute('disabled');
        third_.removeAttribute('disabled');
        fourth.removeAttribute('disabled');
        fourth_.removeAttribute('disabled');
        fifth.removeAttribute('disabled');
        fifth_.removeAttribute('disabled');
        sixth.removeAttribute('disabled');
        sixth_.removeAttribute('disabled');
        seventh.removeAttribute('disabled');
        seventh_.removeAttribute('disabled');
    }
}

function addDude()
{
    var tableRef = document.getElementById('TableList').getElementsByTagName('tbody')[0];
    var newRow = tableRef.insertRow();
    var newCell = newRow.insertCell(0);
    var newText = document.createTextNode('zzz');
    newCell.appendChild(newText);

    var newCell2 = newRow.insertCell(1);
    var newText2 = document.createTextNode('bbbb');
    newCell2.appendChild(newText2);

    var newCell3 = newRow.insertCell(2);
    var newText3 = document.createTextNode('cccc');
    newCell3.appendChild(newText3);

    var cellRank = newRow.insertCell(3);
    var newText4 = document.createTextNode('gggg');
    cellRank.appendChild(newText4);

    var cellHandle = newRow.insertCell(4);
    var newText5 = document.createTextNode('tttt');
    cellHandle.appendChild(newText5);
}