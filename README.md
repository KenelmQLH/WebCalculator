# Web-works
HTML\CSS\JavaScipt
## 实现一个功能较完备的计算器
- 可以实现主要的双目运算和单目运算；
- 可以满足运算符优先级的应用；
- 设置有清除、退格、查看历史记录等功能。

### 优先级算法：
用两个栈分别存储数字和运算符
1. 对于一个运算式字符串，遍历它，（遍历时分离出完整数字），若是数字便进数字栈；
2. 若是运算符，则与运算符栈的栈顶元素比较，若优先级小于栈顶元素，则入栈；
否则，运算符栈出栈一个运算符，数字栈出栈两个数字，进行运算，结果进数字栈

**注意：**单目运算符优先级与双目运算符的优先级同级间的区别
```
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
```
    
### 历史记录 
输出时的处理：
1. 用数组实现一个队列，设置队列大小。
2. 输出第一个结果时，让其重复5次；
此后，对于每个新结果，入队尾；队首元素出队
```
    $("output").onclick=function() {
    
    
        ......


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
          
       }
```
