window.onload = function() {
    
  document.querySelector('form').addEventListener('submit', (e) => {
    const formData = new FormData(e.target);
    // Now you can use formData.get('foo'), for example.
    // Don't forget e.preventDefault() if you want to stop normal form .submission
    console.log(formData)
    e.preventDefault();
    fetch("/edit-order/" + e.target.dataset.id, {
      body: $('form').serialize(),
      credentials: 'include', //pass cookies, for authentication
      method: 'post',
      headers: {
      'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      credentials: 'same-origin'
    })
    .then((res)=>{
      document.getElementsByClassName('success-msg')[0].innerHTML = 'Order updated successfully'
    })
    .catch(function(err) {
      document.getElementsByClassName('error-msg')[0].innerHTML = 'There was an error updating your order'
      console.log(err);
    });

  });


}