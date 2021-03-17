## Microservice avec npm, Node et Espress

**Utilisation**

1.  Le point de terminaison de l'API est POST /api/shorturl/new.
2.  L'API renvoie un JSON ayant la structure `{"original_url": , "short_url": }`.  
    Par exemple `{"original_url":"https://www.freecodecamp.org","short_url":2}`.
3.  Si l'URL n'est pas valide, c'est à dire qui ne ressemble pas à : `http(s)://www.example.com(/plus/chemins)`,  
    l'API renvoie un JSON ayant la structure `{"error": "Invalid URL"}`.
4.  L'URL raccourcie, `/api/shorturl/2` redirige vers le lien d'origine.

**Création d'URL courte**

Réducteur d'URL URL : 

**Exemple d'utilisation**

`[URL_du_projet]/api/shorturl/3`

**Redirigera vers**

`https://www.freecodecamp.org/`
