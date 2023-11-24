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
            "<tr class='item new-item tr'><td data-title='Item' class='td'><input class='form-control' placeholder='Item' name='itemName' autofocus></td> <td data-title='Unit Cost'  class='td'><input class='form-control' type='number' name='itemUnitPrice' placeholder='0.00'></td> <td data-title='Quantity'class='td'><input class='form-control' type='number' name='itemQty' placeholder='0'></td> <td data-title='Price'  class='item-price td'>$0.00</td> <td  class='td'><span class='reset '><i class='fas fa-eraser'></i></span><span class='delete pull-right'><i class='fa-solid fa-trash'></i><span></td>  </tr> "
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
    $('.invoice-info').on("mouseup", ".inv-num", function(e) {
        $('#invoice-num').show().focus();
    });

    $('.invoice-info').on("mouseup", ".inv-duedate", function(e) {
        $("#due-date").show().focus();
    });

    $('.customer-info').on("mouseup", ".inv-date", function(e) {
        $('#invoice-date').show().focus();
    });

    $('.customer-info').on("mouseup", ".inv-cname", function(e) {
        $("#customer-name").show().focus();
    });

    $('.customer-info').on("mouseup", ".inv-caddress1", function(e) {
        $("#customer-address-1").show().focus();
    });

    $('.customer-info').on("mouseup", ".inv-caddress2", function(e) {
        $("#customer-address-2").show().focus();
    });

    $('#invoice-details').on("mouseup", ".inv-tax", function(e) {
        $("#tax-rate").show().focus();
    });




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


const companyName = document.getElementById("company-name");
const firstName = document.getElementById("first-name");
const addressName = document.getElementById("address-name");
const address2Name = document.getElementById("address2-name");
const postalName = document.getElementById("postal-name");
const cityName = document.getElementById("city-name");
const countryName = document.getElementById("country-name");
const phoneName = document.getElementById("phone-name");
const recipientName = document.getElementById("recipient-name");
const emailName = document.getElementById("email-name");
const websiteName = document.getElementById("website-name");



const text1 = document.getElementById("text1");
const text2 = document.getElementById("text2");
const text3 = document.getElementById("text3");
const text4 = document.getElementById("text4");
const text5 = document.getElementById("text5");
const text6 = document.getElementById("text6");
const text7 = document.getElementById("text7");
const text8 = document.getElementById("text8");
const text9 = document.getElementById("text9");
const text10 = document.getElementById("text10");

function val(){
    text1.innerHTML=companyName.value;
    text2.innerHTML=firstName.value;
    text3.innerHTML=addressName.value;
    text4.innerHTML=address2Name.value;
    text5.innerHTML=cityName.value;
    text6.innerHTML=countryName.value;
    text7.innerHTML=phoneName.value;
    text8.innerHTML=recipientName.value;
    text9.innerHTML=emailName.value;
    text10.innerHTML=websiteName.value;


}

const company = document.getElementById("company");
const first = document.getElementById("first");
const last = document.getElementById("last");
const address = document.getElementById("address");
const address1 = document.getElementById("address1");
const code = document.getElementById("code");
const city = document.getElementById("city");
const country = document.getElementById("country");
const number = document.getElementById("number");
const email = document.getElementById("email");
const currency = document.getElementById("currencyme");
const website = document.getElementById("website");



const getval1 = document.getElementById("getval1");
const getval2 = document.getElementById("getval2");
const getval3 = document.getElementById("tgetval3");
const getval4 = document.getElementById("getval4");
const  getval5 = document.getElementById("getval5");
const getval6 = document.getElementById("getval6");
const  getval7 = document.getElementById("getval7");
const getval8 = document.getElementById("getval8");
const  getval9 = document.getElementById("getval9");
const   getval10 = document.getElementById(" getval10");
const  getval11 = document.getElementById("getval11");





function from(){
    getval1.innerHTML= company.value;
    getval2.innerHTML=first.value;
    getval3.innerHTML=address.value;
    getval4.innerHTML=address1.value;
    getval5.innerHTML=code.value;
    getval6.innerHTML=city.value;
    getval7.innerHTML=country.value;
    getval8.innerHTML=number.value;
    getval9.innerHTML=email.value;
    getval10.innerHTML=currency.value;
    getval11.innerHTML=website.value;


} 



// -------------selected----------------


 