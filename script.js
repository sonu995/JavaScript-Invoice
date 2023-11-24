const dropZone = document.querySelector('#drop-zone');
        const inputElement = document.querySelector('input');
        const img = document.querySelector('img');
        let p = document.querySelector('p')
        let icon = document.getElementById('icon')
    

        inputElement.addEventListener('change', function (e) {
            const clickFile = this.files[0];
            if (clickFile) {
                img.style = "display:block;";
                p.style = 'display: none';
                icon.style = 'display: none';
                const reader = new FileReader();
                reader.readAsDataURL(clickFile);
                reader.onloadend = function () {
                    const result = reader.result;
                    let src = this.result;
                    img.src = src;
                    img.alt = clickFile.name
                }
            }
        })
        dropZone.addEventListener('click', () => inputElement.click());
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            img.style = "display:block;";
            let file = e.dataTransfer.files[0];

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = function () {
                e.preventDefault()
                p.style = 'display: none';
                icon.style = 'display: none';
                let src = this.result;
                img.src = src;
                img.alt = file.name
            }
        });

        // ------date picker------
        var date = new Date();
        var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        
        var optSimple = {
          format: 'mm-dd-yyyy',
          todayHighlight: true,
          orientation: 'bottom right',
          autoclose: true,
          container: '#sandbox'
        };
        
        // var optComponent = {
        //   format: 'mm-dd-yyyy',
        //   container: '#datePicker',
        //   orientation: 'auto top',
        //   todayHighlight: true,
        //   autoclose: true
        // };
        
        // SIMPLE
        $( '#simple' ).datepicker( optSimple );

        
        
        
        // // COMPONENT
        // $( '#datePicker' ).datepicker( optComponent );
        
        // // ===================================
        
        // $( '#datepicker1' ).datepicker({
        //   format: "mm : dd : yyyy",
        //   todayHighlight: true,
        //   autoclose: true,
        //   container: '#box1',
        //   orientation: 'top right'
        // });
        
        // $( '#datepicker2' ).datepicker({
        //   format: 'mm \\ dd \\ yyyy',
        //   todayHighlight: true,
        //   autoclose: true,
        //   container: '#box2',
        //   orientation: 'top right'
        // });
        
        $( '#simple, #datePicker' ).datepicker( 'setDate', today );

   



   

        // --------calculation---------------------


        $(document).ready(function() {

    //add a new row
    $('.add-item').on('click', function(e) {
        e.preventDefault();

        //declare variable for new row
        let newItem = $(
            "<tr class='item new-item tr'><td data-title='Item' class='td'><input class='form-control' placeholder='Item' name='itemName' autofocus></td> <td data-title='Unit Cost'  class='td'><input class='form-control' type='number' name='itemUnitPrice' placeholder='0.00'></td> <td data-title='Quantity'class='td'><input class='form-control' type='number' name='itemQty' placeholder='0'></td>  <td> <input class='form-control' id='tax-rate' type='number' name='taxRate' value='13' min='0' /></td>   <td data-title='Price'class='item-price td'>$0.00</td><td  class='td'><span class='reset '><i class='fas fa-eraser'></i></span><span class='delete pull-right'><i class='fa-solid fa-trash'></i><span></td>   </tr> "
        );

        //display new row with fadeIn animation
        $('#invoice-details tr').eq(-4).before([newItem]);
        newItem.hide();
        newItem.fadeIn("slow");

        // get value of item price for computing the total
        $(newItem).find('input[name=itemPrice]').val('');


        // set focus on first input each time a new row is displayed;
        $('input[name=itemName]').focus();
    });


    // set focus on textarea when edit icon is clicked
    // $('.invoice-info').on("mouseup", ".inv-num", function(e) {
    //     $('#invoice-num').show().focus();
    // });

    // $('.invoice-info').on("mouseup", ".inv-duedate", function(e) {
    //     $("#due-date").show().focus();
    // });

    // $('.customer-info').on("mouseup", ".inv-date", function(e) {
    //     $('#invoice-date').show().focus();
    // });

    // $('.customer-info').on("mouseup", ".inv-cname", function(e) {
    //     $("#customer-name").show().focus();
    // });

    // $('.customer-info').on("mouseup", ".inv-caddress1", function(e) {
    //     $("#customer-address-1").show().focus();
    // });

    // $('.customer-info').on("mouseup", ".inv-caddress2", function(e) {
    //     $("#customer-address-2").show().focus();
    // });

    // $('#invoice-details').on("mouseup", ".inv-tax", function(e) {
    //     $("#tax-rate").show().focus();
    // });




    $('#invoice-details').on('click', '.delete', function() {
        $(this).closest('tr').remove();
        calculateTotals();

    });
  
      // clear row values and recalculate totals
    $('#invoice-details').on('click', '.reset', function() {
        $(this).parents('tr').find('input').val('');
        calculateTotals();

    });


    //format currency with decimal and comma
    const formatCurrency = (amount) => {

        return `${Number(amount).toLocaleString("en-US", {style:"currency", currency:"USD", minimumFractionDigits: 2})}`;

    };

    //compute row price
    const calculateItemPrice = (item) => {

        //get values from inputs
        let itemQty = $('input[name=itemQty]', item).val();
        let itemUnitPrice = $('input[name=itemUnitPrice]', item).val();
        

        //compute and format row price
        let itemPrice = (itemQty * itemUnitPrice);
      
        $('.item-price', item).text(formatCurrency(itemPrice));

        return itemPrice;
        
        

    };

    //update row price as you input the values
    $('#invoice-details').on('mouseup keyup', 'input[type=number]', () => calculateTotals());

    //calculate totals
    const calculateTotals = () => {

        //variable to hold all row prices
        let itemPrices = $('.item').map((index, val) => calculateItemPrice(val)).get();

        //reduce all row prices to its sum and format subtotal
        let subtotal = itemPrices.reduce((index, val) => index + Number(val), 0);
        $('.subtotal').text(formatCurrency(subtotal));

        //get value of tax from input and covert to decimal
        let tax = $('input[name=taxRate]').val() / 100;

        //compute tax amount
        let taxAmount = subtotal * tax;

        //compute total
        let total = subtotal + taxAmount;

        //format currency
        $('.tax-amount').text(formatCurrency(taxAmount));
        $('.total').text(formatCurrency(total));
        $('.amount-due').text(formatCurrency(total));


    };



});







//  ----------------from------------------------


// const companyName = document.getElementById("company-name");
// const firstName = document.getElementById("first-name");
// const addressName = document.getElementById("address-name");
// const address2Name = document.getElementById("address2-name");
// const postalName = document.getElementById("postal-name");
// const cityName = document.getElementById("city-name");
// const countryName = document.getElementById("country-name");
// const phoneName = document.getElementById("phone-name");
// const recipientName = document.getElementById("recipient-name");
// const emailName = document.getElementById("email-name");
// const websiteName = document.getElementById("website-name");



// const text1 = document.getElementById("text1");
// const text2 = document.getElementById("text2");
// const text3 = document.getElementById("text3");
// const text4 = document.getElementById("text4");
// const text5 = document.getElementById("text5");
// const text6 = document.getElementById("text6");
// const text7 = document.getElementById("text7");
// const text8 = document.getElementById("text8");
// const text9 = document.getElementById("text9");
// const text10 = document.getElementById("text10");

// function val(){
//     text1.innerHTML=companyName.value;
//     text2.innerHTML=firstName.value;
//     text3.innerHTML=addressName.value;
//     text4.innerHTML=address2Name.value;
//     text5.innerHTML=cityName.value;
//     text6.innerHTML=countryName.value;
//     text7.innerHTML=phoneName.value;
//     text8.innerHTML=recipientName.value;
//     text9.innerHTML=emailName.value;
//     text10.innerHTML=websiteName.value;


// }




function val() {
    // Retrieve input values
    var companyName = document.getElementById("company-name").value;
    var firstName = document.getElementById("first-name").value;
    var addressName = document.getElementById("address-name").value;
    var address2Name = document.getElementById("address2-name").value;
    var postalName = document.getElementById("postal-name").value;
    var cityName = document.getElementById("city-name").value;
    var countryName = document.getElementById("country-name").value;
    var phoneName = document.getElementById("phone-name").value;
    var recipientName = document.getElementById("recipient-name").value;
    var emailName = document.getElementById("email-name").value;
    var websiteName = document.getElementById("website-name").value;

    // Set expiration date to 6 months from the current date
    var expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 6);

    // Set values in cookies with the expiration date
    document.cookie = "companyName=" + encodeURIComponent(companyName) + "; expires=" + expirationDate.toUTCString();
    document.cookie = "firstName=" + encodeURIComponent(firstName) + "; expires=" + expirationDate.toUTCString();
    document.cookie = "addressName=" + encodeURIComponent(addressName) + "; expires=" + expirationDate.toUTCString();
    document.cookie = "address2Name =" + encodeURIComponent(address2Name ) + "; expires=" + expirationDate.toUTCString();
    document.cookie = "cityName =" + encodeURIComponent(cityName ) + "; expires=" + expirationDate.toUTCString();
    document.cookie = "countryName =" + encodeURIComponent(countryName ) + "; expires=" + expirationDate.toUTCString();
    document.cookie = "phoneName =" + encodeURIComponent(phoneName ) + "; expires=" + expirationDate.toUTCString();
    document.cookie = "recipientName =" + encodeURIComponent(recipientName ) + "; expires=" + expirationDate.toUTCString();
    document.cookie = "emailName =" + encodeURIComponent(emailName ) + "; expires=" + expirationDate.toUTCString();
    document.cookie = "websiteName =" + encodeURIComponent(websiteName ) + "; expires=" + expirationDate.toUTCString();
    // ... Set values for other variables as needed

    // Update the text in the modal
    document.getElementById("text1").textContent = companyName;
    document.getElementById("text2").textContent = firstName;
    document.getElementById("text3").textContent = addressName;
    document.getElementById("text4").textContent = address2Name;
    document.getElementById("text5").textContent = postalName;
    document.getElementById("text6").textContent = cityName;
    document.getElementById("text7").textContent = countryName;
    document.getElementById("text8").textContent = phoneName;
    document.getElementById("text9").textContent = recipientName;
    document.getElementById("text10").textContent = emailName;
    document.getElementById("text11").textContent = websiteName;
}


function from() {
    // Retrieve input values
    var company = document.getElementById("company").value;
    var first = document.getElementById("first").value;
    var last = document.getElementById("last").value;
    var address = document.getElementById("address").value;
    var address1 = document.getElementById("address1").value;
    var code = document.getElementById("code").value;
    var city = document.getElementById("city").value;
    var country = document.getElementById("country").value;
    var number = document.getElementById("number").value;
    var email = document.getElementById("email").value;
    var currency = document.getElementById("currency").value;
    var website = document.getElementById("website").value;
  
    // Set expiration date to 6 months from the current date
    var expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 6);
  
    // Set values in cookies with the expiration date
    document.cookie = "company=" + encodeURIComponent(company) + "; expires=" + expirationDate.toUTCString();
    document.cookie = "first=" + encodeURIComponent(first) + "; expires=" + expirationDate.toUTCString();
    document.cookie = "last=" + encodeURIComponent(last) + "; expires=" + expirationDate.toUTCString();
    // ... Set values for other variables as needed
  
    // Update the text in the modal
    document.getElementById("getval1").textContent = company;
    document.getElementById("getval2").textContent = first;
    document.getElementById("getval3").textContent = last;
    document.getElementById("getval4").textContent = address;
    document.getElementById("getval5").textContent = address1;
    document.getElementById("getval6").textContent = code;
    document.getElementById("getval7").textContent = city;
    document.getElementById("getval8").textContent = country;
    document.getElementById("getval9").textContent = number;
    document.getElementById("getval10").textContent = email;
    document.getElementById("getval11").textContent = website;
  }




// const company = document.getElementById("company");
// const first = document.getElementById("first");
// const last = document.getElementById("last");
// const address = document.getElementById("address");
// const address1 = document.getElementById("address1");
// const code = document.getElementById("code");
// const city = document.getElementById("city");
// const country = document.getElementById("country");
// const number = document.getElementById("number");
// const email = document.getElementById("email");
// const currency = document.getElementById("currencyme");
// const website = document.getElementById("website");



// const getval1 = document.getElementById("getval1");
// const getval2 = document.getElementById("getval2");
// const getval3 = document.getElementById("tgetval3");
// const getval4 = document.getElementById("getval4");
// const  getval5 = document.getElementById("getval5");
// const getval6 = document.getElementById("getval6");
// const  getval7 = document.getElementById("getval7");
// const getval8 = document.getElementById("getval8");
// const  getval9 = document.getElementById("getval9");
// const   getval10 = document.getElementById(" getval10");
// const  getval11 = document.getElementById("getval11");





// function from(){
//     getval1.innerHTML= company.value;
//     getval2.innerHTML=first.value;
//     getval3.innerHTML=address.value;
//     getval4.innerHTML=address1.value;
//     getval5.innerHTML=code.value;
//     getval6.innerHTML=city.value;
//     getval7.innerHTML=country.value;
//     getval8.innerHTML=number.value;
//     getval9.innerHTML=email.value;
//     getval10.innerHTML=currency.value;
//     getval11.innerHTML=website.value;


// } 




// -------------selected----------------


document.getElementById("mySelect").addEventListener("change", function() {
    var selectedValue = this.value;
  
    if (selectedValue) {
      window.location.href = selectedValue;
    }
  });
  




  const setAllValuesInCookies = () => {
    let itemElements = $('.item.new-item'); // Assuming the dynamically generated item rows have the class "item" and "new-item"
  
    itemElements.each((index, element) => {
      let itemName = $(element).find('input[name=itemName]').val();
      let itemUnitPrice = $(element).find('input[name=itemUnitPrice]').val();
      let itemQty = $(element).find('input[name=itemQty]').val();
      let itemPrice = itemQty * itemUnitPrice;
  
      setCookie(`itemName_${index}`, itemName, 7); // Set a cookie for each item name, where index is the position of the item
      setCookie(`itemUnitPrice_${index}`, itemUnitPrice, 7); // Set a cookie for each item unit price, where index is the position of the item
      setCookie(`itemQty_${index}`, itemQty, 7); // Set a cookie for each item quantity, where index is the position of the item
      setCookie(`itemPrice_${index}`, itemPrice, 7); // Set a cookie for each item price, where index is the position of the item
    });
  
    let taxRate = $('input[name=taxRate]').val();
    setCookie('taxRate', taxRate, 30); // Set a cookie for the tax rate
  };
  
  setAllValuesInCookies()
  // Example usage

  



//   function takePrint(){
//     print()
//   }

  


var specialElementHandlers = {
    // element with id of "bypass" - jQuery style selector
    '.no-export': function (element, renderer) {
        // true = "handled elsewhere, bypass text extraction"
        return true;
    }
};

function exportPDF(id) {
    var doc = new jsPDF('p', 'pt', 'a4');
    //A4 - 595x842 pts
    //https://www.gnu.org/software/gv/manual/html_node/Paper-Keywords-and-paper-size-in-points.html


    //Html source 
    var source = document.getElementById(id);
console.log(source);
    var margins = {
        top: 10,
        bottom: 10,
        left: 10,
        width: 595
    };

    doc.fromHTML(
        source, // HTML string or DOM elem ref.
        margins.left,
        margins.top, {
            'width': margins.width,
            'elementHandlers': specialElementHandlers
        },

        function (dispose) {
            // dispose: object with X, Y of the last line add to the PDF 
            //          this allow the insertion of new lines after html
            doc.save('Test.pdf');
        }, margins);
}



// Get the table body element
var tableBody = document.querySelector('#invoice-details tbody');

// Get all the rows in the table body
var rows = tableBody.querySelectorAll('tr.item');

// Create an array to store the invoice items
var invoiceItems = [];

// Iterate over each row and extract the input values
rows.forEach(function(row) {
  var itemName = row.querySelector('input[name="itemName"]').value;
  var itemUnitPrice = parseFloat(row.querySelector('input[name="itemUnitPrice"]').value);
  var itemQty = parseInt(row.querySelector('input[name="itemQty"]').value);
  var itemTax = row.querySelector('select#mySelect').value;
  var itemPrice = parseFloat(row.querySelector('.item-price').textContent.substring(1));

  // Create an object for each invoice item and add it to the array
  var item = {
    Item: itemName,
    'Unit Cost': itemUnitPrice,
    Quantity: itemQty,
    Tax: itemTax,
    Price: itemPrice
  };

  invoiceItems.push(item);

  // Output the current invoice item values in the console
  console.log('Item:', itemName);
  console.log('Unit Cost:', itemUnitPrice);
  console.log('Quantity:', itemQty);
  console.log('Tax:', itemTax);
  console.log('Price:', itemPrice);
  console.log('-----------------------');
});

// Output the array of invoice items in the console
console.log('Invoice Items:', invoiceItems);
