# halendar
一个简单的jQuery日历插件

![image](https://github.com/gaoxiaohu/halendar/blob/master/halendar.png)

###使用

``` html
<script src="js/jquery.min.js"></script>
<script src="js/halendar.js"></script>
```

```html
<div id="h"></div>
```

```javascript
$('#h').halendar({
        lang:"ZN",  //语言设置，ZN EN
        onClick: function() { 
           date = this.val(); //所选日期
           console.log(date)
           // some code here
        }
  });
  ```

