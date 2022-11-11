AFRAME.registerComponent("markerhandler", {
    init: async function () {
      var toys = await this.getToys();
  
      //markerFound event
      this.el.addEventListener("markerFound", () => {
        var markerId = this.el.id;      
        this.handleMarkerFound(toys, markerId);
      });
  
      //markerLost event
      this.el.addEventListener("markerLost", () => {
        this.handleMarkerLost();
      });
  
    },
    handleMarkerFound: function (toys, markerId) {
      var todaysDate = new Date();
      var todaysDay = todaysDate.getDay();

      let days = [
        "sunday",
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday'
      ];

      var toy = toys.filter(toy => toy.id === markerId)[0];

      if(toy.unavailable_days.includes(days[todaysDay])){
        swal({
          icon: "warning",
          title: toy.toy_name.toUpperCase(),
          text: "This toy is not available today!!!",
          timer: 2500,
          buttons: false
        });
      }else {
          // Changing Model scale to initial scale
         var model = document.querySelector(`#model-${toys.id}`);
         model.setAttribute("position", toys.model_geometry.position);
         model.setAttribute("rotation", toys.model_geometry.rotation);
         model.setAttribute("scale", toys.model_geometry.scale);
   
         //Update UI conent VISIBILITY of AR scene(MODEL , INGREDIENTS & PRICE)
         model.setAttribute("visible",true);
   
         var ingredientsContainer = document.querySelector(`#main-plane-${toys.id}`);
         ingredientsContainer.setAttribute("visible", true);
   
         var priceplane = document.querySelector(`#price-plane-${toys.id}`);
         priceplane.setAttribute("visible", true)
   
         // Changing button div visibility
         var buttonDiv = document.getElementById("button-div");
         buttonDiv.style.display = "flex";
   
         var ratingButton = document.getElementById("rating-button");
         var orderButtton = document.getElementById("order-button");
   
         // Handling Click Events
         ratingButton.addEventListener("click", function() {
           swal({
             icon: "warning",
             title: "Toy",
             text: "Work In Progress"
           });
         });
   
         orderButtton.addEventListener("click", () => {
           var tNumber;
           toyNumber <= 9 ? (tNumber = `T0${toyNumber}`) : `T${toyNumber}`;
           this.handleOrder(uid, toy);
   
           swal({
             icon: "https://i.imgur.com/4NZ6uLY.jpg",
             title: "Thanks For Order !",
             text: "Your order will arrive soon !",
             timer: 2000,
             buttons: false
           });
         });
       }
      },

      handleOrder(uid,toy){
        firebase
        .firestore()
        .collection()
        .doc(uid)
        .get()
        .then(doc =>{
          var details = doc.data();

          if(details['current_orders'][toy.id]){
            details['current_orders'][toy.id]['quantity'] += 1

            var currentQuantity = details['current_orders'][toy.id]["quantity"];

            details["current_orders"]['toy.id']['subtotal'] = currentQuantity * toy.price;
          }else{
            details["current_orders"]['toy.id'] = {
              item : toy.toy_name,
              price : toy.price,
              quantity : 1,
              subtotal : toy.price * 1
            };
          }

          details.total_bill += toy.price;

          firebase
          .firestore()
          .collection("users")
          .doc(doc.id)
          .update(details);
        })
      },

      getOrderSummary: async function(){
        return await firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then(doc => doc.data());
      },

      handleOrderSummary: async function () {

        var tNumber;
        tNumber <= 9 ? (tNumber = `T0${toyNumber}`) : `T${toyNumber}`;
        
        var orderSummary = await this.getOrderSummary(tNumber);
    
        var modalDiv = document.getElementById("modal-div");
        modalDiv.style.display = "flex";
    
        var toyBodyTag = document.getElementById("bill-table-body");
    
        toyBodyTag.innerHTML = "";
    
        var currentOrders = Object.keys(orderSummary.current_orders);
    
        currentOrders.map(i => {
          var tr = document.createElement("tr");
    
          var item = document.createElement("td");
          var price = document.createElement("td");
          var quantity = document.createElement("td");
          var subtotal = document.createElement("td");
    
          item.innerHTML = orderSummary.current_orders[i].item;
    
          price.innerHTML = "$" + orderSummary.current_orders[i].price;
          price.setAttribute("class", "text-center");
    
          quantity.innerHTML = orderSummary.current_orders[i].quantity;
          quantity.setAttribute("class", "text-center");
    
          subtotal.innerHTML = "$" + orderSummary.current_orders[i].subtotal;
          subtotal.setAttribute("class", "text-center");
    
          tr.appendChild(item);
          tr.appendChild(price);
          tr.appendChild(quantity);
          tr.appendChild(subtotal);
    
          toyBodyTag.appendChild(tr);
        });
    
        var totalTr = document.createElement("tr");
    
        var td1 = document.createElement("td");
        td1.setAttribute("class", "no-line");
    
        var td2 = document.createElement("td");
        td1.setAttribute("class", "no-line");
    
        var td3 = document.createElement("td");
        td1.setAttribute("class", "no-line text-center");
    
        var strongTag = document.createElement("strong");
        strongTag.innerHTML = "Total";
    
        td3.appendChild(strongTag);
    
        var td4 = document.createElement("td");
        td1.setAttribute("class", "no-line text-right");
        td4.innerHTML = "$" + orderSummary.total_bill;
    
        totalTr.appendChild(td1);
        totalTr.appendChild(td2);
        totalTr.appendChild(td3);
        totalTr.appendChild(td4);
    
        toyBodyTag.appendChild(totalTr);
      },

      handleRatings: function(){
        document.getElementById('rating-modal-div').style.display = 'flex';
        document.getElementById('rating-input').value = '0';

        var saveRatingButton = document.getElementById('save-rating-button');
        saveRatingButton.addEventListener("click",() =>{
          document.getElementById("rating-modal-div").style.display = 'none';
          var rating = document.getElementById('rating-input').value;

          firebase
            .firestore()
            .collection()
            .doc(toy.id)
            .update({
              rating : rating
            })
            .then(()=>{
              swal({
                icon : "success",
                title : 'Thanks for rating !',
                text : "We hope you like the toy !",
                timer : 2500,
                buttons : false,
              }) 
            })
        })
      },

      handlePayment: function () {
        document.getElementById("modal-div").style.display = "none";
    
        var tNumber;
        toyNumber <= 9 ? (tNumber = `T0${toyNumber}`) : `T${toyNumber}`;
    
        firebase
          .firestore()
          .collection("toys")
          .doc(tNumber)
          .update({
            current_orders: {},
            total_bill: 0
          })
          .then(() => {
            swal({
              icon: "success",
              title: "Thanks For Paying !",
              text: "We Hope You Will Enjoy Your Toy !!",
              timer: 2500,
              buttons: false
            });
          });
      },
});