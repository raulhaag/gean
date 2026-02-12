export class MyCustomLoader extends Hls.DefaultConfig.loader  {
  constructor(config) {
    super(config);
  }

  async load(context, config, callbacks) {
    // 1. Inicializar tiempos obligatorios
    this.stats.trequest = performance.now(); 
    
    try {
      // 2. Ejecutar tu fGet
      const response = await window.fGet(context.url, { "User-Agent": window.navigator.userAgent}, true);

      // 3. Procesar datos (Hls.js requiere ArrayBuffer para fragmentos)
      let data = response.body;

      // Hls.js v1.x usa 'loading' y 'parsing' dentro de stats
      const now = performance.now();
      this.stats.tfirst = now;
      this.stats.tload = now;
      this.stats.loaded = this.stats.total = (data.byteLength || data.length || 0);

      // Si es un fragmento, convertir a ArrayBuffer (fGet devuelve string)
      if (context.responseType === 'arraybuffer' && typeof data === 'string') {
          data = new TextEncoder().encode(data).buffer;
      }

      const hlsResponse = {
        url: context.url,
        data: data,
        code: 200
      };

      // Llamamos al éxito
      callbacks.onSuccess(hlsResponse, this.stats, context, null);

    } catch (e) {
      callbacks.onError({ code: 0, text: e.message }, context, null);
    }
  }
}

export class MyCustomLoaderFragment extends Hls.DefaultConfig.loader{
    constructor(config) {
    super(config);
  }

  // Sobrescribimos load para usar Fetch
  async load(context, config, callbacks) {
    // Inicializamos stats usando la estructura de la clase base
    this.stats.trequest = performance.now();
    if (this.stats.loading) this.stats.loading.start = this.stats.trequest;

    try {
      const response = await fetch(window.serverHost + "file/" + enc(context.url) + "/" + enc(JSON.stringify({"User-Agent": window.navigator.userAgent})), {
        method: 'GET',
        headers: {
          'User-Agent': window.navigator.userAgent,
          // Hls.js puede pasar headers adicionales en el contexto
          ...(context.headers || {})
        },
        signal: context.signal // Permite que Hls.js aborte la petición
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      this.stats.tfirst = performance.now();
      if (this.stats.loading) this.stats.loading.first = this.stats.tfirst;

      // Hls.js decide el tipo según el contexto (fragmento vs playlist)
      const data = context.responseType === 'arraybuffer' 
        ? await response.arrayBuffer() 
        : await response.text();

      this.stats.tload = performance.now();
      if (this.stats.loading) this.stats.loading.end = this.stats.tload;
      
      this.stats.loaded = this.stats.total = (data.byteLength || data.length || 0);

      callbacks.onSuccess(
        { url: response.url, data: data, code: response.status },
        this.stats,
        context,
        response
      );
    } catch (e) {
      callbacks.onError({ code: 0, text: e.message }, context, null);
    }
  }
}