window.onload = function() {

    var result_str="";
    var result_flag = 0;
    //标记单目运算符
    var dict = [];
    dict["cos"] = "c";dict["sin"] = "s";dict["tan"] = "t";
    dict["acos"] = "C";dict["asin"] = "S";dict["atan"] = "T";
    dict["ln"] = "l"; dict["log2"] = "L";dict["sqrt"] = "Q";

    var history_result = new Array();
    var history_op = new Array();
    var history_num = 0;
    var history_indx = 3; //从队列中的第(四)个历史记录倒回第一个历史记录，第五个为当前的值

    let x=document.getElementsByClassName("ele");
    let sx = document.getElementsByClassName("single");
    /*!-------------------------监听数字和功能按钮!----------------------*/
    /*监听单目运算符*/
    for(let i=0; i<sx.length; i++) {
        sx[i].onclick = function() {
            if(result_flag === 1){ //检查要不要先清零
                clean();
                result_flag = 0;
            }
            result_str += dict[sx[i].id];
            $("box1").value += sx[i].value;
            //console.log("click at "+ sx[i].value + ",mark as "+dict[sx[i].id])
        }
    }
    /*监听数字和双目运算符和自然数e*/
    for(let i=0; i<x.length; i++)
    {
        x[i].onclick = function(){
            if(result_flag === 1){ //检查要不要先清零
                clean();
                result_flag = 0;
            }
            if(x[i].className === "square"){
                result_str += "^2";
                $("box1").value += x[i].value;
            }
            else
            {
                result_str += x[i].value;
                $("box1").value += x[i].value;
            }

        }
    }

    /*-------------------------main work start(计算与输入)--------------------------*/
    /*-------监听输出-----*/
    $("output").onclick=function() {
        var op_stack = new Array("#");
        var num_stack = new Array();
        var queue = new Array();

        result_str += "=";

        let j=0;
        let top="#";
        while(j<result_str.length-1 || top!== "#")
        {
            console.log("##in!##\n");
            if(isNumber(result_str[j]))
            {
                let s = result_str[j];

                j++;
                while(isNumber(result_str[j]))
                {
                    s += result_str[j];
                    j++;
                }
                num_stack.push(s);console.log("push "+s+"\n");
            }
            else
            {

                switch(ralation(op_stack[op_stack.length-1], result_str[j]))
                {
                    case '<':
                        //console.log("!!!"+op_stack[op_stack.length-1] + "<"+  result_str[j]+"\n");
                        op_stack.push(result_str[j]);console.log("push "+result_str[j]+"\n");
                        j++;
                        //console.log("!!!-----!!!After j++"+ result_str[j]+"\n");
                        break;
                    case '=':
                        let tmp=op_stack.pop();//console.log("pop "+tmp+"\n");
                        j++;
                        break;
                    case '>':
                        //console.log("-----in '>' -----\n");
                        let OP = op_stack.pop();console.log("pop "+OP+"\n");
                        let t;
                        if((OP==="c"||OP==="s"||OP==="t"||OP==="C"||OP==="S"||OP==="T"||OP==="l"||OP==="L"||OP==="Q"))
                        {
                            let C = num_stack.pop();console.log("pop "+C+"\n");
                            t = operation_single(C,OP);
                        }
                        else
                        {
                            let B = num_stack.pop();console.log("pop "+B+"\n");
                            let A = num_stack.pop();console.log("pop "+A+"\n");
                            t = operation(A,OP,B);
                        }
                        num_stack.push(t);console.log("push "+t+"\n");
                        break;
                }
            }

            top = op_stack.pop();
            console.log("op_stack.top = "+top+"\n");
            op_stack.push(top);
        }
        console.log("finish calculated ----------------\n");
        $("box2").value = num_stack[0];
        result_flag = 1;

        /*将输出的第一个结果重复存储5次*/
        if(history_num < 5)
        {
            while(history_num < 5){
            history_op.push(result_str.substring(0,result_str.length-1));
            history_result.push(num_stack[0]);
            history_num ++;
            }
        }
        /*后面用队列来更新历史记录*/
        else{
            history_result.shift();
            history_op.shift();
            history_result.push(num_stack[0])
            history_op.push(result_str.substring(0,result_str.length-1));
        }
        console.log("showing all history: \n");
        for(let i=0;i<5;i++)
        {
            console.log("indx" + i + ":"+ history_op[i] + "=" + history_result[i]+"\n");
        }
    }

    /*-----判断字符串是否是数字包括小数点-----*/
    function isNumber(val) {
        let regPos = /^\d+(\.\d+)?$/; //非负浮点数
        let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if(regPos.test(val) || regNeg.test(val)) {
            return true;
        } else if(val==="."||val==="e") return true;
        else return false;
    }

    /*-----------------定义优先级----------------*/
    //单目 ==> ^ ==> */ ==> +-
    function ralation(a, b)
    {
        if(a==='^' && (b==='+'||b==='-'||b==='*'||b==='/')) return '>';

        else if((a==='/'||a==='*')&&(b==='+'||b==='-')) return '>';
        else if((a==='+'||a==='-')&&(b==='+'||b==='-')) return '>';
        else if ((a==='*'||a==='/')&&(b==='*'||b==='/')) return '>';

        else if(a!=='('&&b===')') return '>';
        else if(a==='('&&b===')') return '=';
        else if(
            (a==="c"||a==="s"||a==="t"||a==="C"||a==="S"||a==="T"||a==="l"||a==="L"||a==="Q")&&
            (b!=="c"&&b!=="s"&&b!=="t"&&b!=="C"&&b!=="b"&&b!=="T"&&b!=="l"&&b!=="L"&&b!=="Q"))
        {
            return ">";
        } //注意这里单目运算符与双目运算符，平级的区别

        else if(b ==='=') return '>';
        else
            return '<';
    }
    /*------------运算--------------*/
    function operation_single(c, op){
        let nc;
        if(c==="e")
        {
            nc= Math.E;
        }
        else
        {
            let pat = /./;
            nc = (pat.test(c)? parseFloat(c): parseInt(c));  //判断是否是小数
        }

        let r;
        switch(op)
        {
            case "c":r = Math.cos(nc);break;
            case "s":r = Math.sin(nc);break;
            case "t":r = Math.tan(nc);break;
            case "C":r = Math.acos(nc);break;
            case "S":r = Math.asin(nc);break;

            case "T":r = Math.atan(nc);break;
            case "l":r = Math.log(nc);break;
            case "L":r = Math.log(nc)/Math.log(2.0);break;
            case "Q":r = Math.sqrt(nc);break;
        }
        return String(r);
    }

    function operation(a,op,b)
    {
        let patt = /./;
        let na = (patt.test(a)? parseFloat(a): parseInt(a));  //判断是否是小数
        let nb =  (patt.test(b)? parseFloat(b): parseInt(b));
        let r;
        switch(op)
        {
            case "+":
                r = na + nb;
                break;
            case "-":
                r = na - nb;
                break;
            case "*":
                r = na * nb;
                break;
            case "/":
                r = parseFloat(a) / parseFloat(b);
                break;
            case "^":
                r = Math.pow(na,nb);
                break;
        }
        return String(r);
    }
    /*-------------------------main work finished---------------------------*/

    /*----------清空输入--------*/
    $("res").onclick= function(){
        clean();
    }

    function clean()
    {
        if($("box1").value !== "") $("box1").value = "";
        if($("box2").value !== "0") $("box2").value = "0";
        result_str = "";
    }
    /*----------退格---------*/
    $("back").onclick=function(){
        var s = $("box1").value;
        if(s.length == 1)
        {
            $("box1").value = "0";
            result_str = "";
        }
        else
        {

            switch(result_str[result_str.length-1])
            {
                case "s":
                case "c":
                case "t":
                    $("box1").value = s.substring(0,s.length-3);
                    result_str = s.substring(0,s.length-1);
                    break;
                case "S":
                case "C":
                case "T":
                case "L":
                    $("box1").value = s.substring(0,s.length-4);
                    result_str = s.substring(0,s.length-1);
                    break;
                case "l":
                    $("box1").value = s.substring(0,s.length-2);
                    result_str = s.substring(0,s.length-1);
                    break;
                default:
                    if($("box1").value[$("box1").value.length-1] === "²")
                    {
                        $("box1").value = s.substring(0,s.length-1);
                        result_str = s.substring(0,s.length-2);
                    }
                    else
                    {
                        $("box1").value = s.substring(0,s.length-1);
                        result_str = s.substring(0,s.length-1);
                    }
                    break;
            }

        }


    }

    /*---------最多输出5个历史结果---------*/
    $("history").onclick=function(){
        if(history_indx >= 0){
            $("box1").value = history_op[history_indx];
            $("box2").value = history_result[history_indx];

            console.log(" history_indx:"+history_indx+"\n");
            history_indx--;
            console.log("After history_indx--, history_indx:"+history_indx+"\n");
        }
        if(history_indx < 0) history_indx=4;
    }

    function $(id){
        return document.getElementById(id);
    }
}