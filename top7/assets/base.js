$(function() {
    var i = Number(localStorage.getItem('todo-counter')) + 1,
        j = 0,
        k,
        $form = $('#todo-form'),
        $removeLink = $('#show-items li a'),
        $itemList = $('#show-items'),
        $editable = $('.editable'),
        $clearAll = $('#clear-all'),
        $newTodo = $('#todo'),
        order = [],
        orderList;

    // Load todo list
    orderList = localStorage.getItem('todo-orders');
    
    orderList = orderList ? orderList.split(',') : [];
    
    for( j = 0, k = orderList.length; j < k; j++) {
        $itemList.append(
            "<li id='" + orderList[j] + "'>"
            + "<span class='editable'>" 
            + localStorage.getItem(orderList[j]) 
            //trash icon
            + "</span> <a href='#'>X</a></li>"
            //+ "</span> <a href='#'> <img src="trash.png"/> X</a></li>"
        );
    }
        
   
    $form.submit(function(e) {
        e.preventDefault();
        $.publish('/add/', []);
    });

    $itemList.delegate('a', 'click', function(e) {
        var $this = $(this);
        
        e.preventDefault();
        $.publish('/remove/', [$this]);
    });
    

    $itemList.sortable({
        revert: true,
        stop: function() {
            $.publish('/regenerate-list/', []);
        }
    });
    

    $editable.inlineEdit({
        save: function(e, data) {
                var $this = $(this);
                localStorage.setItem(
                    $this.parent().attr("id"), data.value
                );
            }
    });

    $clearAll.click(function(e) {
        e.preventDefault();
        $.publish('/clear-all/', []);
    });


    $itemList.delegate('li', 'mouseover mouseout', function(event) {
        var $this = $(this).find('a');
        
        if(event.type === 'mouseover') {
            $this.stop(true, true).fadeIn();
        } else {
            $this.stop(true, true).fadeOut();
        }
    });

    $.subscribe('/add/', function() {
        if ($newTodo.val() !== "") {
            localStorage.setItem( 
                "todo-" + i, $newTodo.val() 
            );
            localStorage.setItem('todo-counter', i);
            $itemList.append(
                "<li id='todo-" + i + "'>"
                + "<span class='editable'>"
                + localStorage.getItem("todo-" + i) 
                + " </span><a href='#'>x</a></li>"
            );

            $.publish('/regenerate-list/', []);
            $("#todo-" + i)
                .css('display', 'none')
                .fadeIn();
            $newTodo.val("");
            
            i++;
        }
    });
    
    $.subscribe('/remove/', function($this) {
        var parentId = $this.parent().attr('id');
        
        localStorage.removeItem(
            "'" + parentId + "'"
        );
       $this.parent().fadeOut(function() { 
            $this.parent().remove();
            
            $.publish('/regenerate-list/', []);
        });
    });
    
    $.subscribe('/regenerate-list/', function() {
        var $todoItemLi = $('#show-items li');
        order.length = 0;
        $todoItemLi.each(function() {
            var id = $(this).attr('id');
            order.push(id);
        });
        localStorage.setItem(
            'todo-orders', order.join(',')
        );
    });
    
    $.subscribe('/clear-all/', function() {
        var $todoListLi = $('#show-items li');
        
        order.length = 0;
        localStorage.clear();
        $todoListLi.remove();
    });
});
