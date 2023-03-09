$(document).ready(function () {
    var list = JSON.parse(localStorage.getItem("task"));
    filters = document.querySelectorAll(".filter-blk span");
    // add list
    $("#form").on("submit", function (e) {
        e.preventDefault();
        var input = $(".text_box").val().trim();
        if (!list) {
            list = [];
        }
        if (!input.length < 1) {
            var task = { task: input, status: "active" };
            list.push(task);
            localStorage.setItem("task", JSON.stringify(list));
            $(".text_box").val("");
            var id = list.length - 1;
            var li = "";
            if (list) {
                var isCompleted = list[id].status == "completed" ? "checked" : "";
                li += `<li class="clearfix">
                                   <p class="list-blk">
                                       <input type="checkbox" class="checkbox"  value="${input}" id="${id}" ${isCompleted}><label class="${isCompleted} task_name">${input}</label>
                                       <button class="delete" value="${id}">x</button>
                                   </p>
                         </li>`;
                $('.resultList').append(li);
            }
            total();
        }
        else {
            
        }

    });
    // to filt status 
    $.each(filters, function (btn, btn) {
        btn.addEventListener("click", () => {
            document.querySelector("span.active").classList.remove("active");
            btn.classList.add("active");
            showData(btn.id);
        });
    });
    // show data function 
    function showData(filter) {
        var li = "";
        var list = JSON.parse(localStorage.getItem("task"));
        if (list) {
            $.each(list, function (id, todo) {
                var isCompleted = todo.status == "completed" ? "checked" : "";
                if (filter == todo.status || filter == "all") {
                    li += `<li class="clearfix">
                                        <p class="list-blk">
                                            <input type="checkbox" class="checkbox"  value="${todo.task}" id="${id}" ${isCompleted}><label class="${isCompleted} task_name">${todo.task}</label>
                                            <button class="delete" value="${id}">x</button>
                                        </p>
                              </li>`;
                }
            });
            $('.resultList').empty().append(li);
        }
    }
    // make complete
    $("ul").on("click", ".checkbox", function () {
        $(this).closest("li").find(".task_name").toggleClass("checked");
        $(this).closest("label").toggleClass("checked");

        var id = $(this).attr('id');
        if ($(this).closest("li").find("label").hasClass('checked')) {
            list[id].status = "completed";
        }
        else {
            list[id].status = "active";
        }
        localStorage.setItem("task", JSON.stringify(list));
        total();

    });
    // delete task list
    $("ul").on("click", ".delete", function () {
        $(this).closest("li").fadeOut(200);
        var taskId = $(this).val();
        list.splice(taskId, 1);
        localStorage.setItem("task", JSON.stringify(list));
        total();
    });
    // edit task list name
    $("ul").on("dblclick", ".task_name", function () {
        $(this).closest("li").find("input").attr("type", "text");
        $(this).closest("li").find("input").removeClass("checkbox");
        $(this).closest("li").find("input").addClass("edit_checkbox");
        $(this).hide();
        $(this).closest("li").find("button").hide();
    });
    // update task list name
    $("ul").on("blur", ".edit_checkbox", function () {
        $(this).closest("li").find("input").attr("type", "checkbox");
        $(this).closest("li").find("input").removeClass("edit_checkbox");
        $(this).closest("li").find("input").addClass("checkbox");
        $(this).closest("li").find("label").show();
        $(this).closest("li").find("label").text($(this).val().trim());
        $(this).closest("li").find("button").show();
        var id = $(this).attr('id');
        if (!$(this).val().trim() < 1) {

            list[id].task = $(this).val();
            localStorage.setItem("task", JSON.stringify(list));
        }
        showData("all");

    });
    // check all task list
    $("#btn-checkall").click(function () {
        var len = $('.task_name').length;
        if ($(this).text() == "Check All") {
            if(len!=0){
                $(this).text("Uncheck All");
            }
            for ($i = 0; $i < len; $i++) {
                $(".checkbox").attr("checked", true);
                list[$i].status = "completed";
            }
        }
        else {
            for ($i = 0; $i < len; $i++) {
                $(this).text("Check All");
                $(".checkbox").attr("checked", false);
                list[$i].status = "active";
            }
        }
        localStorage.setItem("task", JSON.stringify(list));
        showData("all");
        total();
    });
    //delete all
    $("#btn-deleteall").click(function () {
        list = list.filter(todo => todo.status != "completed");
        localStorage.setItem("task", JSON.stringify(list));
        $('#btn-checkall').text("Check All");
        total();
        showData("all");
    });
    // to show complete total task list
    function total() {
        if (list) {
            activeTotal = list.filter(todo => todo.status == "active");
            var total = activeTotal.length;
            $('#total').text(total);
        }
    }
    total();
    showData("all");
});
