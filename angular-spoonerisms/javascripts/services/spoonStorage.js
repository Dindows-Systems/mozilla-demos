spoonmod.factory( 'spoonStorage', function() {
  var STORAGE_ID = 'local-spoons';

  return {
    get: function() {
      return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
    },

    put: function( spoons ) {
      localStorage.setItem(STORAGE_ID, JSON.stringify(spoons));
    }
  };
});