module.exports = function readProdKey(ctx) {
  if (ctx.production_key == null && ctx.resource_translated_id) {
    ctx.production_key = ''
    App.server.fromAuth(ctx.resource_translated_id)
      .then(res => {
        $('#production_key_str').text(
          ctx.production_key = res.resource && res.resource.nomenclature || ''
        )
      })
  }
}
