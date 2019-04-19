# drag.js  
drag.js是一款拖动排序插件，适配pc端和手机端。  
demo地址 --https://tls1234.github.io/drag     
# html 结构
```js
<ul class="item-group">
   <li class="item">item1</li>
   <li class="item">item2</li>
   <li class="item">item3</li>
   <li class="item">item4</li>
   <li class="item">item5</li>
</ul>
```
## 用法  
只需要new一个 Drag()对象
> new Drag( ) 
## 参数 
第一个参数为ul元素  
第二个参数为一个Object对象 (此对象可省略，则启用默认配置)  
其中 supernatant为拖动时候的浮层元素的一些样式配置项， select为底层选中的元素样式配置项    
```js
var drag = new Drag('.item-group', {
		supernatant: {
			boxShadow : "0 4px 10px #DEDADA",
			background : '#fff',
			opacity: '0.8'
		},
		select: {
			background: '#efefef'
		}
	})
```
