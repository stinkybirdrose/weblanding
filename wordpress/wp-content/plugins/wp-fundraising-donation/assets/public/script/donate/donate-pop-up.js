function wfp_donation_pop_up_donation_list(e) {
  let donation_type = document.querySelector(".donation_type");
  let fixed = document.querySelector(".wfp-donation-pop-up-fixed");
  let multiple = document.querySelectorAll(".wfp-donation-pop-up-multi");
  multiple.forEach((item) => {
    item.style.display = "none";
  });
  fixed.style.display = "none";

  let data = e.options[e.options.selectedIndex];
  let type = data.dataset.type;
  let active = document.querySelector(
    ".wfp-donation-pop-up-multi-" + data.dataset.no
  );
  let form = e.closest(".wfp-form");
  let custom = form.querySelector(".wfp-donation-pop-up-form-group-custom");
  let permalink = data.dataset.permalink;
  donation_type.value = type;
  if (permalink) {
    e.closest("form").action = permalink;
  }

  if (custom) {
    custom.parentNode.removeChild(custom);
  }
  if (type == "fixed-lebel") {
    let price = data.dataset.price;
    if (data.dataset.enable_custom_amount == "No") {
      fixed.innerHTML =
        '<label for="">Fixed Amount</label><input type="text" name="type" value="' +
        price +
        '" readonly>';
    } else {
      fixed.innerHTML =
        '<label for="">Amount</label><select onchange="wfp_pop_up_custom_amount(this)" name="type" required><option value="' +
        price +
        '">' +
        price +
        '</option><option value="custom">Custom</option></select>';
    }
    fixed.style.display = "block";
  } else {
    if (active) {
      active.style.display = "block";
    }
  }
}

function wfp_pop_up_custom_amount(e) {
  let form = e.closest(".wfp-form");
  let custom = form.querySelector(".wfp-donation-pop-up-form-group-custom");
  if (e.options[e.options.selectedIndex].value == "custom") {
    if (!custom) {
      form.insertAdjacentHTML(
        "beforeend",
        '<div class="wfp-donation-pop-up-form-group wfp-donation-pop-up-form-group-custom"><label for="">Custom Amount</label><input min="1" name="custom_amount" type="number" required/></div>'
      );
    }
  } else {
    if (custom) {
      custom.parentNode.removeChild(custom);
    }
  }
}
