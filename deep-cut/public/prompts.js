// Prompt pool.
//
// Format: "Display name=share|alias|alias; next answer..."
//   share  = estimated percent of 100 people who would give this answer.
//            Leave it off for long-tail answers (they default to 0.2).
//   alias  = other accepted spellings. Case, accents, punctuation, spaces and
//            simple plurals are already handled, so only list real variants.
//
// The shares are editorial estimates, not survey data. They only need to be
// right relative to each other: the most common answer scores 5 points, an
// answer almost nobody gives scores close to 100.

export const THEMES = ["Food", "Places", "Nature", "Culture", "Science", "Everyday"];

export const PROMPTS = [
  // ---------------- Food ----------------
  {
    id: "fruit", theme: "Food", text: "Name a fruit",
    answers: `
      apple=20; banana=15; orange=9; strawberry=8; mango=6; grape=5; pineapple=4; watermelon=4; peach=3;
      pear=3; cherry=3; kiwi=2|kiwifruit; blueberry=2; lemon=1.5; plum=1; raspberry=1; pomegranate=1;
      papaya=0.8|pawpaw; apricot=0.8; coconut=0.8; lime=0.6; fig=0.6; grapefruit=0.6; blackberry=0.6;
      melon=0.6; date=0.5; nectarine=0.4; cantaloupe=0.4|rockmelon; guava=0.4; lychee=0.4|litchi|lichee;
      passion fruit=0.4|passionfruit|maracuja; dragon fruit=0.4|pitaya|pitahaya; avocado=0.4; tangerine=0.3;
      clementine=0.3; mandarin=0.3; honeydew=0.3; tomato=0.3; cranberry; persimmon|kaki; quince; jackfruit;
      durian; rambutan; mangosteen; starfruit|carambola; gooseberry; elderberry; mulberry; kumquat; loquat;
      feijoa; jabuticaba; salak|snake fruit; ackee; soursop|guanabana; cherimoya|custard apple; longan;
      sapodilla|chikoo|chiku; tamarind; physalis|cape gooseberry|ground cherry; yuzu; olive;
      blackcurrant|currant|redcurrant; boysenberry; lingonberry; cloudberry; huckleberry; medlar; pomelo;
      ugli fruit; plantain; breadfruit; miracle fruit; noni; marula; baobab; jujube; acerola; bilberry; damson;
      greengage; sloe; rowan; prickly pear; horned melon|kiwano; buddhas hand; finger lime; calamansi;
      bergamot; citron; ice cream bean; monk fruit
    `,
  },
  {
    id: "vegetable", theme: "Food", text: "Name a vegetable",
    answers: `
      carrot=18; broccoli=12; potato=8; lettuce=5; cucumber=5; tomato=4; spinach=4; onion=4; pea=3; cabbage=3;
      corn=3|sweetcorn|maize; cauliflower=3; pepper=3|bell pepper|capsicum; celery=2;
      green bean=2|bean|string bean|french bean; zucchini=2|courgette; eggplant=2|aubergine|brinjal;
      sweet potato=1.5; kale=1.5; asparagus=1.5; mushroom=1; beetroot=1|beet; brussels sprout=1|sprout;
      garlic=0.8; radish=0.6; pumpkin=0.6; squash=0.5|butternut squash; leek=0.5; artichoke=0.4; turnip=0.4;
      parsnip=0.4; okra=0.4|ladyfinger|bhindi; chard=0.3|swiss chard; bok choy=0.3|pak choi|bok choi;
      arugula=0.2|rocket; fennel; kohlrabi; rutabaga|swede; celeriac; jicama; daikon|mooli; taro;
      cassava|yuca|manioc; yam; bitter melon|bitter gourd|karela; chayote|choko; salsify; romanesco;
      watercress; endive; radicchio; shallot; scallion|spring onion|green onion; lotus root; bamboo shoot;
      jerusalem artichoke|sunchoke; samphire; fiddlehead; burdock; water chestnut; moringa|drumstick; edamame;
      collard greens|collard; mustard greens; broad bean|fava bean; snow pea|mangetout; parsley root;
      bottle gourd|lauki|calabash; ridge gourd; snake gourd; tindora|ivy gourd;
      molokhia|mulukhiyah|jute mallow; purslane; chicory; sorrel; nettle; seaweed; lentil; chickpea; alfalfa;
      bean sprout; kai lan|chinese broccoli|gai lan; tatsoi; mizuna; napa cabbage|chinese cabbage;
      pattypan squash; spaghetti squash; acorn squash; delicata squash; hearts of palm; cardoon;
      ramp|wild garlic; oca; ulluco; yacon; malanga; plantain
    `,
  },
  {
    id: "cheese", titleCase: true, theme: "Food", text: "Name a type of cheese",
    answers: `
      cheddar=24; mozzarella=15; parmesan=9|parmigiano|parmigiano reggiano; brie=7;
      swiss=5|emmental|emmentaler; feta=5; gouda=5; blue cheese=3|blue; camembert=3;
      goat cheese=2|chevre|goats cheese; provolone=2; american=1.5; ricotta=1.5; halloumi=1.5|hellim;
      monterey jack=1|jack|pepper jack; cream cheese=1; cottage cheese=1; gruyere=1; colby=0.6; stilton=0.8;
      gorgonzola=0.8; roquefort=0.6; mascarpone=0.6; manchego=0.6; edam=0.6; pecorino=0.5|pecorino romano;
      havarti=0.4; paneer=0.4; burrata=0.4; wensleydale=0.3; red leicester; double gloucester; comte;
      jarlsberg; asiago; fontina; taleggio; raclette; munster|muenster; limburger; reblochon; epoisses;
      scamorza; oaxaca; cotija; queso fresco; akkawi; labneh; nabulsi; kashkaval; tete de moine; caerphilly;
      lancashire; cheshire; manouri; kefalotyri; graviera; leerdammer; boursin; port salut; mimolette;
      casu marzu; brunost|gjetost; quark; queso blanco; idiazabal; mahon; tilsit; appenzeller; vacherin;
      morbier; danish blue; cambozola; tomme; saint agur; pule; stracciatella; caciocavallo; grana padano;
      ricotta salata; provola; bocconcini; string cheese; velveeta; brick; humboldt fog; chhurpi; kalari;
      bandel; jibneh|jibne; shanklish; tulum; ezine; beyaz peynir; mish; domiati; rumi; requeson; panela
    `,
  },
  {
    id: "dessert", theme: "Food", text: "Name a dessert",
    answers: `
      ice cream=22; cake=14|chocolate cake; brownie=8; cheesecake=7; cookie=6; pie=5|apple pie; tiramisu=4;
      pudding=3; donut=3|doughnut; cupcake=3; creme brulee=2; mousse=2|chocolate mousse; macaron=1.5;
      churros=1.5|churro; gelato=1.5; sundae=1; cobbler=1; crumble=1|apple crumble; trifle=1; panna cotta=1;
      baklava=1; flan=1|creme caramel; jelly=0.8|jello; sorbet=0.8; fudge=0.6; eclair=0.6;
      profiterole=0.5|cream puff; banana split=0.5; pavlova=0.5; key lime pie=0.5; tart=0.5;
      kunafa=0.5|knafeh|kanafeh|kunafeh|kanafa; gulab jamun=0.4; mochi=0.4; cannoli=0.4; um ali=0.3|om ali;
      strudel=0.3|apple strudel; sticky toffee pudding=0.3; bread pudding; rice pudding; eton mess;
      baked alaska; souffle; clafoutis; tarte tatin; mille feuille|millefeuille|napoleon;
      black forest cake|black forest gateau; red velvet cake; carrot cake; lamington; brigadeiro; tres leches;
      halva|halwa|halawa; luqaimat|lugaimat; basbousa; rasmalai; kheer; jalebi; kulfi; mango sticky rice;
      halo halo; bingsu; dango; daifuku; pastel de nata|pasteis de nata|egg tart; zabaglione|sabayon; affogato;
      semifreddo; cassata; sfogliatella; parfait; smores; whoopie pie; blondie; galette; crepe; waffle;
      beignet; loukoumades|luqmat; malva pudding; koeksister; trdelnik; kouign amann; financier; madeleine;
      mont blanc; frozen yogurt|froyo; meringue; strawberry shortcake|shortcake; banoffee pie; treacle tart;
      spotted dick; jam roly poly; syllabub; posset; christmas pudding|figgy pudding; sachertorte;
      linzer torte; kaiserschmarrn; pastel de tres leches; muhallebi|muhallabia|mahalabia; aseeda;
      qatayef|atayef; maamoul; sheer khurma; gajar halwa|gajar ka halwa; rasgulla; sandesh; mysore pak;
      payasam; bebinca; leche flan; dulce de leche; alfajor; arroz con leche; turron; panettone; zeppole;
      bombolone; crostata; gianduja; pain perdu|french toast; tarte au citron|lemon tart; paris brest;
      croquembouche; opera cake; dacquoise; charlotte; pudim; quindim; queijadinha; malasada; poffertjes;
      stroopwafel; oliebollen; kladdkaka; semla; prinsesstarta; pashka; medovik; napoleon cake; ptichye moloko;
      sufganiyah; rugelach; babka; hamantaschen
    `,
  },
  {
    id: "spice", theme: "Food", text: "Name a herb or spice",
    answers: `
      cinnamon=12; basil=10; pepper=9|black pepper|peppercorn; oregano=7; paprika=6|smoked paprika; cumin=6;
      garlic=5; thyme=5; rosemary=5; parsley=4; ginger=4; turmeric=4;
      chili=3|chilli|chili powder|cayenne|chili flakes; mint=3; nutmeg=3; cardamom=3; coriander=2|cilantro;
      saffron=2; dill=2; clove=2; sage=1.5; bay leaf=1|bay; curry powder=1; chive=1; vanilla=1; star anise=0.8;
      mustard seed=0.6|mustard; fennel seed=0.5|fennel; sumac=0.5; zaatar=0.5|zatar|zahtar;
      allspice=0.4|pimento; tarragon=0.4; marjoram=0.4; fenugreek=0.4|methi; garam masala=0.4; lemongrass=0.3;
      caraway=0.3; anise=0.3|aniseed; mace; juniper|juniper berry; asafoetida|hing; ajwain|carom;
      nigella|kalonji|black seed|black cumin; galangal; kaffir lime leaf|makrut lime leaf|lime leaf;
      curry leaf; sichuan pepper|szechuan pepper; pink peppercorn; long pepper; grains of paradise;
      amchur|amchoor|mango powder; annatto|achiote; epazote; lovage; savory; chervil; sorrel; borage;
      shiso|perilla; mahlab|mahleb; baharat; ras el hanout; berbere; five spice|chinese five spice;
      sassafras|file powder; wasabi; horseradish; celery seed; poppy seed; sesame; loomi|black lime|dried lime;
      white pepper; cassia; dukkah; herbes de provence; mixed spice; pumpkin spice; old bay; tajin; shichimi;
      gochugaru; aleppo pepper|pul biber; urfa biber|isot; dried rose|rose petal; saffron threads;
      licorice root|liquorice; stevia; chamomile; lavender; lemon balm; lemon verbena; hyssop; rue; angelica;
      mugwort; culantro|sawtooth coriander; thai basil; holy basil|tulsi; vietnamese coriander|rau ram;
      fingerroot|krachai; pandan
    `,
  },

  // ---------------- Places ----------------
  {
    id: "africa", titleCase: true, theme: "Places", text: "Name a country in Africa",
    answers: `
      egypt=18; nigeria=12; south africa=12; kenya=9; morocco=7; ethiopia=5; ghana=4; algeria=3; tanzania=3;
      uganda=2; somalia=2; sudan=2; zimbabwe=2; senegal=1.5; libya=1.5; tunisia=1.5;
      DR Congo=1.2|democratic republic of the congo|drc|congo kinshasa|democratic republic of congo;
      cameroon=1; rwanda=1; madagascar=1; namibia=0.8; botswana=0.8; zambia=0.8; mali=0.8; angola=0.6;
      ivory coast=0.6|cote divoire; mozambique=0.6; sierra leone=0.5; liberia=0.5; niger=0.5; chad=0.4;
      malawi=0.4; burkina faso=0.3; gambia=0.3; south sudan=0.3; eritrea=0.3; mauritania=0.3; mauritius=0.3;
      seychelles=0.2; republic of the congo|congo|congo brazzaville; gabon; guinea; guinea bissau;
      equatorial guinea; benin; togo; burundi; djibouti; lesotho; eswatini|swaziland; cape verde|cabo verde;
      sao tome and principe|sao tome; comoros; central african republic|car
    `,
  },
  {
    id: "eu-capital", titleCase: true, theme: "Places", text: "Name a capital city in Europe",
    answers: `
      london=20; paris=20; rome=10; berlin=10; madrid=9; amsterdam=4; athens=3; vienna=3; lisbon=3; dublin=3;
      brussels=2; prague=2; moscow=2; stockholm=1.5; oslo=1; copenhagen=1; warsaw=1; budapest=1; helsinki=0.6;
      bern=0.4|berne; reykjavik=0.4; edinburgh=0.4; kyiv=0.4|kiev; bucharest=0.3; sofia=0.3; belgrade=0.3;
      zagreb=0.3; tallinn; riga; vilnius; bratislava; ljubljana; sarajevo; podgorica; skopje; tirana; chisinau;
      minsk; valletta; nicosia; luxembourg; monaco; vaduz; san marino; andorra la vella; vatican city|vatican;
      pristina; cardiff; belfast; ankara; tbilisi; yerevan; baku; torshavn; douglas; st helier|saint helier;
      st peter port|saint peter port; gibraltar; nuuk
    `,
  },
  {
    id: "us-state", titleCase: true, theme: "Places", text: "Name a US state",
    answers: `
      california=18; texas=14; florida=9; new york=9; alaska=4; hawaii=4; washington=3; ohio=2; nevada=2;
      arizona=2; colorado=2; georgia=2; illinois=1.5; michigan=1.5; massachusetts=1.5; new jersey=1.5;
      oregon=1.2; pennsylvania=1.2; virginia=1; louisiana=1; tennessee=1; utah=0.8; kentucky=0.8; alabama=0.8;
      north carolina=0.8; south carolina=0.6; montana=0.6; idaho=0.5; kansas=0.5; oklahoma=0.5; maine=0.5;
      mississippi=0.5; missouri=0.4; minnesota=0.4; wisconsin=0.4; iowa=0.4; indiana=0.4; arkansas=0.4;
      vermont=0.3; wyoming=0.3; new mexico=0.3; nebraska=0.3; maryland=0.3; connecticut=0.3; west virginia;
      north dakota; south dakota; delaware; rhode island; new hampshire
    `,
  },
  {
    id: "island", titleCase: true, theme: "Places", text: "Name an island",
    answers: `
      hawaii=8|big island; bali=8; jamaica=6; greenland=5; madagascar=5; iceland=5; sicily=4; ireland=3;
      cuba=3; tasmania=3; great britain=3|britain; sri lanka=2; crete=2; cyprus=2; mallorca=2|majorca;
      ibiza=1.5; santorini=1.5|thira; malta=1.5; sardinia=1; corsica=1; capri=0.8; mykonos=0.8; barbados=0.8;
      bermuda=0.8; fiji=0.8; tahiti=0.6; bora bora=0.6; borneo=0.6; sumatra=0.5; java=0.5; phuket=0.5;
      singapore=0.5; taiwan=0.5; manhattan=0.5; long island=0.4; maui=0.4; oahu=0.4; new guinea=0.4;
      honshu=0.3; zanzibar=0.3|unguja; mauritius=0.3; saadiyat=0.3|saadiyat island; yas island=0.3|yas;
      easter island|rapa nui; kauai; hokkaido; okinawa; mahe; socotra; bahrain; isabela; spitsbergen;
      baffin island|baffin; ellesmere; victoria island; newfoundland; vancouver island; prince edward island;
      isle of man; isle of wight; skye|isle of skye; lewis; anglesey; jersey; guernsey; gotland; rhodes; corfu;
      lesbos; gozo; elba; ischia; tenerife; gran canaria; lanzarote; madeira; sao miguel; trinidad; tobago;
      aruba; curacao; st lucia|saint lucia; grenada; antigua; puerto rico; hispaniola; martinique; guadeloupe;
      nantucket; Martha's Vineyard; alcatraz; sakhalin; hainan; jeju; luzon; mindanao; cebu; palawan; boracay;
      komodo; lombok; sulawesi|celebes; penang; langkawi; koh samui|ko samui; lord howe island;
      K'gari|fraser island; kangaroo island; north island; south island; stewart island; pitcairn;
      tristan da cunha; st helena|saint helena; ascension; christmas island; rottnest; tierra del fuego;
      chiloe; sentosa; kish; qeshm; hormuz; failaka; lamu; pemba; bioko; reunion; wrangel island;
      novaya zemlya; delma; sir bani yas; abu dhabi
    `,
  },
  {
    id: "river", titleCase: true, theme: "Places", text: "Name a river",
    answers: `
      nile=25; amazon=18; thames=8; mississippi=8; seine=4; danube=4; ganges=4|ganga; yangtze=3|chang jiang;
      rhine=3; euphrates=2; tigris=2; mekong=1.5; volga=1.5; congo=1; hudson=1; colorado=1; missouri=0.8;
      jordan=0.8; indus=0.8; rio grande=0.6; tiber=0.5; zambezi=0.5; niger=0.5; loire=0.5;
      yellow river=0.5|huang he; ohio=0.4; st lawrence=0.3|saint lawrence; columbia=0.3; delaware; potomac;
      mersey; severn; tyne; clyde; shannon; liffey; elbe; oder; vistula; dnieper|dnipro; don; ural; ob;
      yenisei; lena; amur; brahmaputra; irrawaddy|ayeyarwady; chao phraya; salween; murray; darling; yukon;
      mackenzie; fraser; snake; parana; orinoco; uruguay; magdalena; limpopo; orange; senegal; okavango; ebro;
      douro|duero; tagus|tajo|tejo; guadalquivir; po; arno; rhone; garonne; dordogne; meuse|maas; moselle;
      main; neckar; inn; sava; drava; dniester; kura; helmand; amu darya|oxus; syr darya; kaveri|cauvery;
      godavari; narmada; yamuna; krishna; pearl river|zhujiang; han; sumida; charles; chicago; avon; cam; wye;
      trent; ouse; dee; spey; tay; litani; orontes|asi; barada; karun; kabul; sutlej; chenab; jhelum; ravi;
      beas; tennessee; arkansas; red river; platte; sacramento; san joaquin; susquehanna;
      rio de la plata|river plate; sao francisco; xingu; tapajos; madeira; negro|rio negro; purus; jurua;
      ucayali; maranon; tocantins; araguaia; mahaweli; kwanza|cuanza; ogooue; tana; jubba; shebelle; awash;
      blue nile; white nile; atbara; kagera; ruvuma; volta; gambia; benue; ubangi; kasai; lualaba
    `,
  },

  // ---------------- Nature ----------------
  {
    id: "sea-animal", theme: "Nature", text: "Name an animal that lives in the sea",
    answers: `
      shark=18; whale=14; dolphin=12; octopus=8; jellyfish=5; fish=3; starfish=3|sea star; crab=3;
      turtle=3|sea turtle; seal=3; squid=2; stingray=2|ray; orca=2|killer whale; clownfish=1.5; lobster=1.5;
      seahorse=1; eel=1; manta ray=0.8|manta; shrimp=0.8|prawn; tuna=0.8; sea lion=0.8; walrus=0.6;
      penguin=0.6; sea otter=0.6|otter; blue whale=0.6; humpback whale=0.5|humpback; narwhal=0.5;
      sea urchin=0.4|urchin; coral=0.4; sea anemone=0.4|anemone; swordfish=0.4; barracuda=0.3;
      pufferfish=0.3|blowfish|puffer; angelfish=0.3; cod=0.3; salmon=0.3; krill=0.3; oyster=0.3; clam=0.3;
      mussel; scallop; sea cucumber; nudibranch; manatee; dugong; beluga; sperm whale;
      hammerhead shark|hammerhead; great white shark|great white; whale shark; moray eel|moray; lionfish;
      grouper|hammour; marlin; sailfish; sunfish|mola mola|mola; anglerfish; viperfish; gulper eel; oarfish;
      cuttlefish; nautilus; plankton; sea snake; sea spider; giant isopod|isopod; hagfish; lamprey; sardine;
      anchovy; herring; mackerel; halibut; flounder; sole; plaice; barnacle; sponge; sea slug; sea butterfly;
      siphonophore; portuguese man o war|man o war; vampire squid; giant squid; colossal squid; dumbo octopus;
      blobfish; frilled shark; goblin shark; greenland shark; basking shark; megamouth shark; wobbegong;
      parrotfish; triggerfish; surgeonfish|tang; wrasse; goby; blenny; remora; pilot fish; flying fish;
      needlefish; coelacanth; hermit crab; spider crab; king crab; mantis shrimp; pistol shrimp; copepod;
      amphipod; sea pen; feather star; brittle star; sand dollar; sea lily; comb jelly; box jellyfish; salp;
      sea squirt|tunicate; leatherback turtle|leatherback; hawksbill turtle|hawksbill;
      loggerhead turtle|loggerhead; elephant seal; leopard seal; fur seal; polar bear; sea krait; stonefish;
      cleaner shrimp; moon jellyfish; lanternfish; hatchetfish; fangtooth; sea robin; john dory; monkfish;
      skate; sawfish; guitarfish; electric ray|torpedo ray; blue tang; yellowfin tuna; bluefin tuna;
      bottlenose dolphin; spinner dolphin; vaquita; pilot whale; minke whale; fin whale; bowhead whale;
      gray whale|grey whale; right whale; beaked whale
    `,
  },
  {
    id: "bird", theme: "Nature", text: "Name a bird",
    answers: `
      eagle=14; parrot=8; penguin=7; robin=6; owl=6; pigeon=5|dove; flamingo=4; crow=4|raven; ostrich=4;
      sparrow=3; peacock=3|peafowl; hummingbird=3; falcon=3; hawk=2; chicken=2; duck=2; swan=2; seagull=2|gull;
      toucan=1.5; blue jay=1.5|jay; cardinal=1.2; woodpecker=1; pelican=1; goose=1; vulture=1; turkey=1;
      emu=0.8; kiwi=0.8; magpie=0.6; parakeet=0.6|budgie|budgerigar; macaw=0.6; canary=0.5; heron=0.5;
      stork=0.5; kingfisher=0.5; cockatoo=0.4; blackbird=0.4; starling=0.4; swallow=0.4; puffin=0.4;
      albatross=0.4; condor=0.3; finch=0.3; wren; thrush; nightingale; lark|skylark; cuckoo; kookaburra;
      roadrunner; quail; pheasant; partridge; grouse; ptarmigan; crane; egret; ibis; spoonbill; cormorant;
      gannet; booby; frigatebird; tern; petrel; shearwater; loon|diver; grebe; coot; moorhen; rail; bustard;
      houbara; plover; sandpiper; curlew; avocet; oystercatcher; lapwing; snipe; woodcock; kestrel; osprey;
      harrier; kite; buzzard; secretary bird; shoebill; hornbill; hoopoe; bee eater; roller; oriole; tanager;
      warbler; tit|chickadee; nuthatch; treecreeper; mockingbird; catbird; bowerbird; lyrebird;
      bird of paradise; cassowary; rhea; kakapo; kea; lorikeet; lovebird; cockatiel; mynah|myna; bulbul;
      drongo; shrike; waxwing; bunting; grosbeak; goldfinch; chaffinch; bullfinch; linnet; siskin; weaver;
      sunbird; quetzal; trogon; motmot; jacana; hoatzin; potoo; nightjar; frogmouth; swift; dodo; moa;
      great auk; passenger pigeon; whooping crane; bald eagle; golden eagle; harpy eagle; snowy owl; barn owl;
      peregrine falcon|peregrine; saker falcon|saker; gyrfalcon; mallard; teal; wigeon; pintail; eider;
      merganser; scoter; canada goose
    `,
  },
  {
    id: "tree", theme: "Nature", text: "Name a type of tree",
    answers: `
      oak=25; pine=12; maple=10; palm=8|palm tree|date palm; birch=5; willow=5|weeping willow;
      apple=3|apple tree; cherry=3|cherry blossom; spruce=2; fir=2|christmas tree; cedar=2; redwood=2|sequoia;
      elm=2; ash=1.5; beech=1.5; sycamore=1; poplar=1; baobab=1; eucalyptus=1|gum tree; aspen=0.8;
      chestnut=0.6|horse chestnut; cypress=0.6; magnolia=0.6; olive=0.6; walnut=0.5; hazel=0.4; larch=0.4;
      holly=0.4; yew=0.4; banyan=0.4; mango=0.3; lemon=0.3; orange=0.3; coconut=0.3; acacia=0.3; ghaf=0.3;
      neem=0.3; teak=0.3; mahogany=0.3; ebony; rosewood; sandalwood; bamboo; jacaranda; dogwood; hickory;
      pecan; alder; hornbeam; linden|lime tree|basswood; rowan|mountain ash; hawthorn; juniper; hemlock;
      douglas fir; giant sequoia; bristlecone pine; joshua tree; dragon blood tree|dragons blood tree;
      sidr|christ thorn|jujube tree; frankincense|boswellia; myrrh; cork oak; monkey puzzle; ginkgo;
      dawn redwood; kauri; jarrah; karri; wattle; mangrove; tamarind; fig; peepal|sacred fig|bodhi tree;
      rubber tree; kapok; ceiba; silk cotton; flame tree|flamboyant|royal poinciana; tulip tree; sweetgum;
      catalpa; locust|black locust; mesquite; palo verde; ironwood; cottonwood; tupelo; sassafras; buckeye;
      persimmon; pear; plum; peach; apricot; almond; pistachio; cashew; avocado; cacao; coffee; tea; cinnamon;
      clove; nutmeg; breadfruit; jackfruit; durian; rambutan; lychee; moringa; cinchona; balsa; brazil nut;
      sapele; wenge; zebrawood; lignum vitae; elder; whitebeam; service tree; spindle; box|boxwood;
      laurel|bay laurel; myrtle; tamarisk; umbrella pine|stone pine; scots pine; lodgepole pine;
      ponderosa pine; white pine; black spruce; norway spruce; blue spruce; western red cedar;
      cedar of Lebanon; deodar; arborvitae|thuja; leylandii|leyland cypress; monterey cypress; bald cypress;
      weeping fig|ficus
    `,
  },
  {
    id: "flower", theme: "Nature", text: "Name a flower",
    answers: `
      rose=30; tulip=12; sunflower=10; daisy=8; lily=6; orchid=5; lavender=3; daffodil=3; poppy=2; lotus=2;
      jasmine=2; carnation=1.5; violet=1.5; hibiscus=1.5; marigold=1.2; dandelion=1.2; iris=1; peony=1;
      chrysanthemum=1|mum; hydrangea=1; lilac=0.8; magnolia=0.6; cherry blossom=0.6|sakura; dahlia=0.6;
      gardenia=0.5; begonia=0.4; geranium=0.4; petunia=0.4; pansy=0.4; buttercup=0.4; bluebell=0.4;
      forget me not=0.4; snowdrop=0.3; crocus=0.3; azalea=0.3; camellia=0.3; lily of the valley=0.3; gerbera;
      zinnia; aster; cosmos; foxglove; hyacinth; freesia; gladiolus; anemone; ranunculus; sweet pea;
      snapdragon; lupin|lupine; delphinium; larkspur; hollyhock; morning glory; bougainvillea;
      frangipani|plumeria; bird of paradise|strelitzia; protea; heather; edelweiss; primrose; cowslip; clover;
      thistle; cornflower; chamomile; calendula; nasturtium; impatiens|busy lizzie; fuchsia; amaryllis; allium;
      agapanthus; anthurium; calla lily; tiger lily; water lily; honeysuckle; wisteria; clematis;
      passionflower|passion flower; oleander; tuberose; heliotrope; verbena; salvia; phlox; coreopsis;
      echinacea|coneflower; black-eyed Susan|rudbeckia; yarrow; goldenrod; gaillardia; statice;
      baby's breath|gypsophila; stock; wallflower; sweet william; dianthus; alyssum; lobelia; ageratum;
      celosia; gomphrena; portulaca|moss rose; vinca|periwinkle; corpse flower|rafflesia|titan arum;
      desert rose|adenium; saffron crocus; bleeding heart; columbine; trillium; lady slipper; venus flytrap;
      poinsettia; christmas cactus; kalanchoe; cyclamen; african violet; gloxinia; peace lily; stephanotis;
      ixora; lantana; plumbago; marguerite; osteospermum; gazania; dimorphotheca; ice plant; arum lily;
      nigella|love in a mist; scabiosa
    `,
  },
  {
    id: "dog", titleCase: true, theme: "Nature", text: "Name a dog breed",
    answers: `
      labrador=16|labrador retriever|lab; golden retriever=12; german shepherd=10|alsatian; poodle=6;
      bulldog=5|english bulldog; chihuahua=5; husky=4|siberian husky; beagle=4; pug=3; dalmatian=3;
      rottweiler=3; french bulldog=2.5|frenchie; boxer=2; corgi=2|welsh corgi|pembroke welsh corgi;
      dachshund=2|sausage dog|wiener dog; shih tzu=1.5; yorkshire terrier=1.5|yorkie; pomeranian=1.5;
      great dane=1.5; border collie=1.2|collie; doberman=1.2|dobermann|doberman pinscher;
      pit bull=1|pitbull|american pit bull terrier; saint bernard=1|st bernard; greyhound=1; maltese=0.8;
      cocker spaniel=0.8|spaniel; jack russell=0.6|jack russell terrier; schnauzer=0.6; shiba inu=0.6|shiba;
      akita=0.5; samoyed=0.5; bichon frise=0.4|bichon; cavalier king charles spaniel=0.4|cavalier;
      australian shepherd=0.4|aussie; bernese mountain dog=0.4; newfoundland=0.3; mastiff=0.3; bloodhound=0.3;
      basset hound=0.3; whippet=0.3; saluki=0.3; afghan hound; borzoi; irish wolfhound; scottish deerhound;
      weimaraner; vizsla; pointer; setter|irish setter; springer spaniel; cockapoo; labradoodle; goldendoodle;
      cavapoo; shar pei; chow chow; lhasa apso; pekingese; papillon; havanese; bolognese; coton de tulear;
      basenji; rhodesian ridgeback; staffordshire bull terrier|staffy|staffie; bull terrier;
      west highland terrier|westie; scottish terrier|scottie; cairn terrier; airedale terrier|airedale;
      border terrier; bedlington terrier; fox terrier; norfolk terrier; norwich terrier; skye terrier;
      dandie dinmont terrier; kerry blue terrier; wheaten terrier; boston terrier; rat terrier;
      miniature pinscher|min pin; italian greyhound; pharaoh hound; ibizan hound; azawakh; sloughi;
      xoloitzcuintli|xolo|mexican hairless; peruvian inca orchid; chinese crested; komondor; puli; kuvasz;
      leonberger; great pyrenees|pyrenean mountain dog; anatolian shepherd|kangal; tibetan mastiff;
      caucasian shepherd; cane corso; dogue de bordeaux; neapolitan mastiff; bullmastiff; old english sheepdog;
      shetland sheepdog|sheltie; belgian malinois|malinois; dutch shepherd;
      australian cattle dog|blue heeler|heeler; kelpie; alaskan malamute|malamute; keeshond; schipperke;
      norwegian elkhound; finnish spitz; lundehund; otterhound; harrier; foxhound; coonhound; plott hound;
      treeing walker coonhound; catahoula; chesapeake bay retriever; flat coated retriever;
      nova scotia duck tolling retriever|toller; portuguese water dog; lagotto romagnolo; spinone; brittany;
      german shorthaired pointer; wirehaired pointing griffon; brussels griffon; affenpinscher; japanese chin;
      tosa; kai ken; kishu; jindo; thai ridgeback; canaan dog; telomian
    `,
  },

  // ---------------- Culture ----------------
  {
    id: "instrument", theme: "Culture", text: "Name a musical instrument",
    answers: `
      guitar=24; piano=20; drums=10|drum; violin=10; flute=5; trumpet=4; saxophone=4|sax; cello=3; clarinet=2;
      harp=2; ukulele=1.5; bass=1.5|bass guitar|double bass; trombone=1.5; keyboard=1; harmonica=1; tuba=1;
      xylophone=1; oboe=0.8; viola=0.6; accordion=0.6; banjo=0.6; bagpipes=0.5|bagpipe; french horn=0.5|horn;
      tambourine=0.5; triangle=0.4; organ=0.4; oud=0.4; sitar=0.4; recorder=0.4; mandolin=0.3; bassoon=0.3;
      synthesizer=0.3|synth; cymbal; glockenspiel; marimba; vibraphone; timpani; bongo; conga; djembe; tabla;
      darbuka|doumbek|goblet drum; riq; daf; qanun|kanun; nay|ney; rebab|rababa; buzuq; saz|baglama; santur;
      tar; kamancheh; erhu; guzheng; pipa; dizi; shamisen; koto; shakuhachi; taiko; gamelan; angklung;
      kalimba|mbira|thumb piano; kora; balafon; talking drum; steelpan|steel drum; cuatro; charango;
      pan flute|panpipes; ocarina; didgeridoo; theremin; hurdy gurdy; lute; lyre; zither; dulcimer;
      hammered dulcimer; autoharp; harpsichord; clavichord; celesta; melodica; harmonium; concertina;
      bandoneon; euphonium; flugelhorn; cornet; piccolo; bass clarinet; contrabassoon;
      cor anglais|english horn; sousaphone; mellophone; bugle; alphorn; shofar; conch; kazoo;
      jaw harp|jews harp; washboard; spoons; cajon; castanets; maracas; guiro; cowbell; claves; cabasa;
      wood block; gong; tam tam; handpan|hang drum; tongue drum; singing bowl; bodhran; uilleann pipes;
      tin whistle|penny whistle; fiddle; viola da gamba; balalaika; bouzouki; domra; gusli; duduk; zurna;
      mizmar; sarangi; sarod; veena; tanpura; shehnai; bansuri; mridangam; ghatam; dhol; dholak; tumbi;
      santoor; khim; ranat
    `,
  },
  {
    id: "board-game", titleCase: true, theme: "Culture", text: "Name a board game",
    answers: `
      monopoly=26; chess=22; scrabble=8; checkers=6|draughts; snakes and ladders=5|chutes and ladders;
      clue=4|cluedo; backgammon=3|tawla|tavla; risk=3; catan=2|settlers of catan; ludo=2|parcheesi|pachisi;
      trivial pursuit=1.5; connect four=1|connect 4; battleship=1; go=1|baduk|weiqi; game of life=1|life;
      sorry=0.8; operation=0.5; guess who=0.5; mancala=0.5|oware|bao; ticket to ride=0.5; carcassonne=0.4;
      pandemic=0.4; chinese checkers=0.4; jenga=0.3; othello=0.3|reversi; stratego=0.3;
      candy land=0.3|candyland; mouse trap=0.3|mousetrap; hungry hungry hippos; trouble; pictionary; taboo;
      codenames; azul; wingspan; splendor; dominion; terraforming mars; gloomhaven; twilight imperium;
      agricola; puerto rico; power grid; small world; king of tokyo; dixit; mysterium; scythe; root;
      spirit island; everdell; brass; arkham horror; betrayal at house on the hill; diplomacy; axis and allies;
      hex; nine mens morris; senet; royal game of ur|game of ur; shogi; xiangqi|chinese chess; janggi; makruk;
      carrom; mahjong; parchis; halma; fox and geese; hnefatafl|tafl; pente; gomoku; blokus; qwirkle; rummikub;
      boggle; yahtzee; upwords; balderdash; cranium; scattergories; dominoes; kingdomino; patchwork; cascadia;
      quacks of quedlinburg; sushi go; love letter; coup; the resistance; secret hitler; one night werewolf;
      mastermind; abalone; quoridor; hive; onitama; santorini; tsuro; labyrinth; hotel; payday; masterpiece;
      careers; acquire; cosmic encounter; dune; eldritch horror; mansions of madness; star realms; 7 wonders;
      castles of burgundy; viticulture; concordia; great western trail; ark nova; dune imperium;
      lost ruins of arnak; heat; cartographers; just one; wavelength; decrypto; the crew; hanabi;
      forbidden island; flash point; robinson crusoe; mage knight; through the ages; terra mystica; le havre;
      caylus; tigris and euphrates; el grande
    `,
  },
  {
    id: "ball-sport", theme: "Culture", text: "Name a sport played with a ball",
    answers: `
      football=30|soccer; basketball=20; tennis=10; baseball=6; volleyball=6; cricket=5; golf=4; rugby=3;
      american football=3|gridiron; table tennis=2|ping pong; handball=1.5; bowling=1.5|ten pin bowling;
      hockey=1|field hockey; water polo=1; pool=1|billiards|snooker; squash=0.8; softball=0.6; dodgeball=0.6;
      netball=0.5; lacrosse=0.5; polo=0.4; padel=0.4; pickleball=0.4; racquetball=0.3; kickball=0.3;
      futsal=0.3; beach volleyball=0.3; croquet; bocce|boules|petanque; lawn bowls|bowls; gaelic football;
      hurling; camogie; australian rules football|aussie rules|afl; rugby league; rugby sevens; sepak takraw;
      jai alai|pelota|basque pelota; fives; real tennis; rounders; stoolball; korfball; tchoukball; goalball;
      boccia; sitting volleyball; wheelchair basketball; footvolley; teqball; kin ball; bossaball;
      roundnet|spikeball; four square; tetherball; wallyball; paddleball; sipa; chinlone|caneball; cycle ball;
      horseball; underwater rugby; canoe polo; floorball; bandy; shinty; knattleikr; lagori|pittu; kemari;
      cuju; ulama|mesoamerican ballgame; calcio storico; la soule; harpastum; episkyros; keepy uppy;
      foot golf|footgolf; skee ball; marbles
    `,
  },
  {
    id: "myth", titleCase: true, theme: "Culture", text: "Name a mythical creature",
    answers: `
      dragon=26; unicorn=20; mermaid=8; phoenix=6; vampire=5; werewolf=4; griffin=3|gryphon|griffon;
      fairy=3|faerie; centaur=2.5; pegasus=2.5; troll=2; goblin=2; minotaur=2; yeti=2|abominable snowman;
      bigfoot=1.5|sasquatch; medusa=1.5|gorgon; kraken=1.2; loch ness monster=1|nessie; elf=1;
      genie=1|jinn|djinn|jinni; cyclops=1; hydra=1; sphinx=1; giant=0.8; dwarf=0.6; ogre=0.6; banshee=0.5;
      leprechaun=0.5; siren=0.5; chupacabra=0.5; zombie=0.4; ghost=0.4; basilisk=0.4; chimera=0.4; harpy=0.4;
      satyr=0.3|faun; nymph=0.3; wyvern=0.3; cerberus=0.3; gnome=0.3; golem=0.3; kitsune; tengu; kappa; oni;
      yokai; tanuki; baku; nue; jorogumo; rokurokubi; qilin|kirin; nian; jiangshi; huli jing; naga; garuda;
      rakshasa; vetala; makara; nandi; airavata; simurgh; roc|rukh; buraq; ghoul|ghul; ifrit|efreet; marid;
      nasnas; bahamut; manticore; lamia; empusa; echidna; typhon; scylla; charybdis; cetus; hippogriff; ladon;
      python; argus; talos; automaton; fenrir; jormungandr|midgard serpent; sleipnir; nidhogg; valkyrie;
      draugr; huldra; nisse|tomte; nokken|neck; selkie; kelpie; each uisge; bean sidhe; pooka|puca; dullahan;
      brownie; boggart; redcap; will o the wisp; wyrm; lindworm; tatzelwurm; krampus; baba yaga; domovoi;
      leshy; rusalka; vodyanoy; firebird|zhar ptitsa; alkonost; sirin; gamayun; zmey; strigoi; moroi; wendigo;
      skinwalker; thunderbird; jackalope; mothman; jersey devil; ahool; mokele mbembe; tikoloshe|tokoloshe;
      adze; anansi; impundulu; grootslang; bunyip; yowie; taniwha; patupaiarehe; menehune; aswang; tikbalang;
      manananggal; kapre; duwende|duende; nuno; bakunawa; penanggalan; pontianak|kuntilanak; toyol
    `,
  },
  {
    id: "language", titleCase: true, theme: "Culture", text: "Name a language",
    answers: `
      english=20; spanish=18; french=12; arabic=8; chinese=6|mandarin|mandarin chinese; german=6; japanese=4;
      italian=4; russian=3; portuguese=3; hindi=3; korean=2; urdu=1.5; turkish=1; greek=1; latin=1; dutch=0.8;
      swedish=0.6; persian=0.6|farsi; bengali=0.6|bangla; hebrew=0.5; polish=0.5; tagalog=0.5|filipino;
      swahili=0.5|kiswahili; cantonese=0.4; thai=0.4; vietnamese=0.4; indonesian=0.4|bahasa indonesia;
      malay=0.3|bahasa melayu; punjabi=0.3; tamil=0.3; norwegian=0.3; danish=0.3; finnish=0.3;
      irish=0.3|irish gaelic; welsh=0.3; ukrainian=0.3; czech; slovak; hungarian; romanian; bulgarian; serbian;
      croatian; bosnian; slovenian; macedonian; albanian; estonian; latvian; lithuanian; icelandic; faroese;
      scottish gaelic|gaelic; breton; cornish; manx; basque|euskara; catalan; galician; occitan; maltese;
      luxembourgish; romansh; frisian; afrikaans; zulu; xhosa; sotho; tswana; shona; ndebele; amharic;
      tigrinya; oromo; somali; hausa; yoruba; igbo; fula|fulani|pulaar; wolof; twi|akan; ewe; lingala;
      kinyarwanda; kirundi; luganda; malagasy; berber|tamazight|amazigh; kurdish; pashto; dari; balochi;
      sindhi; gujarati; marathi; telugu; kannada; malayalam; odia|oriya; assamese; nepali; sinhala; dhivehi;
      burmese; khmer; lao; mongolian; tibetan; uyghur; kazakh; uzbek; kyrgyz; turkmen; tajik;
      azerbaijani|azeri; georgian; armenian; chechen; tatar; bashkir; yakut|sakha; javanese; sundanese;
      balinese; cebuano; ilocano; hawaiian; maori; samoan; tongan; fijian; tok pisin; quechua; aymara; guarani;
      nahuatl; maya|yucatec maya; navajo; cherokee; cree; inuktitut; ojibwe; lakota; sanskrit; pali;
      ancient greek; aramaic; coptic; akkadian; sumerian; old norse; old english; esperanto; yiddish; ladino;
      romani; sign language|asl|american sign language|bsl|british sign language; hmong; karen; shan; zhuang;
      hakka; hokkien; teochew; wu|shanghainese; ainu; ryukyuan|okinawan; chamorro; marshallese; palauan; tetum;
      rapanui; tahitian; greenlandic|kalaallisut; sami; karelian; votic; livonian; sorbian; rusyn; belarusian
    `,
  },

  // ---------------- Science ----------------
  {
    id: "element", theme: "Science", text: "Name a chemical element",
    answers: `
      oxygen=14; hydrogen=12; gold=10; carbon=9; iron=7; helium=6; nitrogen=5; silver=4; copper=3; sodium=3;
      calcium=2; uranium=2; lead=2; aluminium=2|aluminum; neon=2; chlorine=1.5; zinc=1.5; platinum=1.2;
      mercury=1.2; potassium=1.2; magnesium=1; lithium=1; sulfur=1|sulphur; silicon=0.8; plutonium=0.8;
      tin=0.8; nickel=0.6; titanium=0.6; phosphorus=0.6; fluorine=0.5; iodine=0.5; argon=0.4; cobalt=0.4;
      radium=0.3; chromium=0.3; tungsten=0.3|wolfram; boron; beryllium; scandium; vanadium; manganese; gallium;
      germanium; arsenic; selenium; bromine; krypton; rubidium; strontium; yttrium; zirconium; niobium;
      molybdenum; technetium; ruthenium; rhodium; palladium; cadmium; indium; antimony; tellurium; xenon;
      caesium|cesium; barium; lanthanum; cerium; praseodymium; neodymium; promethium; samarium; europium;
      gadolinium; terbium; dysprosium; holmium; erbium; thulium; ytterbium; lutetium; hafnium; tantalum;
      rhenium; osmium; iridium; thallium; bismuth; polonium; astatine; radon; francium; actinium; thorium;
      protactinium; neptunium; americium; curium; berkelium; californium; einsteinium; fermium; mendelevium;
      nobelium; lawrencium; rutherfordium; dubnium; seaborgium; bohrium; hassium; meitnerium; darmstadtium;
      roentgenium; copernicium; nihonium; flerovium; moscovium; livermorium; tennessine; oganesson
    `,
  },
  {
    id: "bone", theme: "Science", text: "Name a bone in the human body",
    answers: `
      femur=24|thigh bone; skull=14|cranium; rib=10; spine=5|backbone|spinal column|vertebral column;
      tibia=5|shin bone|shinbone; humerus=4|funny bone; pelvis=4|hip bone|hip; jaw=3|jawbone|mandible;
      collarbone=3|clavicle; fibula=2; radius=2; ulna=2; vertebra=2|vertebrae; kneecap=2|patella;
      sternum=1.5|breastbone; scapula=1.5|shoulder blade; coccyx=1|tailbone; stapes=1|stirrup;
      phalanges=0.8|phalanx|finger bone; metacarpal=0.5; metatarsal=0.5; tarsal=0.3; carpal=0.4; sacrum=0.4;
      maxilla=0.4; hyoid=0.4; incus=0.4|anvil; malleus=0.4|hammer; ilium; ischium; pubis; atlas; axis;
      calcaneus|heel bone; talus|ankle bone; navicular; cuboid; cuneiform; scaphoid; lunate; triquetrum;
      pisiform; trapezium; trapezoid; capitate; hamate; zygomatic|cheekbone; nasal bone; lacrimal; vomer;
      palatine; sphenoid; ethmoid; frontal bone; parietal; temporal bone; occipital;
      inferior nasal concha|turbinate; sesamoid; xiphoid process|xiphoid; manubrium; floating rib;
      cervical vertebra; thoracic vertebra; lumbar vertebra; hallux; os coxae|innominate bone
    `,
  },
  {
    id: "solar", titleCase: true, theme: "Science", text: "Name something that orbits the Sun",
    answers: `
      earth=24; mars=18; jupiter=12; saturn=10; venus=6; mercury=5; neptune=4; uranus=4; pluto=5;
      Halley's Comet=2|halley's comet|halley; asteroid=1.5; comet=1.5; ceres=0.6; eris=0.4; haumea=0.3;
      makemake=0.3; vesta=0.3; pallas; juno; hygiea; sedna; quaoar; orcus; gonggong; varuna; ixion;
      arrokoth|ultima thule; bennu; ryugu; itokawa; eros; apophis; psyche; didymos; dimorphos; ida; gaspra;
      mathilde; lutetia; steins; hale bopp; shoemaker levy 9; encke; tempel 1; wild 2;
      churyumov gerasimenko|67p; neowise; hyakutake; swift tuttle; oumuamua; borisov; parker solar probe;
      voyager 1|voyager; voyager 2; pioneer 10; pioneer 11; new horizons; ulysses; solar orbiter; spitzer;
      kepler space telescope|kepler; tesla roadster|starman; lucy; dawn; rosetta; juno spacecraft;
      kuiper belt object; trojan; centaur; chiron
    `,
  },
  {
    id: "unit", theme: "Science", text: "Name a unit of measurement",
    answers: `
      meter=18|metre; kilogram=10|kilo; inch=8; centimeter=7|centimetre; foot=6|feet; mile=6; gram=5;
      kilometer=5|kilometre|km; liter=4|litre; pound=4|lb; second=3; ounce=2; yard=2; celsius=2|degree celsius;
      fahrenheit=1.5; watt=1.5; volt=1.2; newton=1; joule=1; ampere=0.8|amp; kelvin=0.8; hour=0.8; minute=0.6;
      millimeter=0.6|millimetre; gallon=0.6; ton=0.5|tonne; pint=0.5; acre=0.4; hectare=0.4; byte=0.4;
      calorie=0.4; ohm=0.4; hertz=0.4; decibel=0.3; pascal=0.3; mole=0.3; candela=0.3;
      light year=0.3|lightyear; nautical mile; knot; furlong; fathom; league; chain; rod|perch|pole; cubit;
      hand; span; stone; grain; carat|karat; dram; hundredweight; quart; cup; tablespoon; teaspoon;
      fluid ounce; bushel; peck; barrel; cord; coulomb; farad; henry; siemens; weber; tesla; lumen; lux;
      becquerel; gray; sievert; katal; radian; steradian; parsec; astronomical unit|au; angstrom;
      micron|micrometre|micrometer; nanometer|nanometre; fermi; barn; electronvolt|ev; erg; dyne; gauss;
      maxwell; poise; stokes; torr; bar; atmosphere|atm; psi; horsepower; btu; therm; rankine; mach; shaku;
      tsubo; li; jin; tola; seer; maund; bigha; kanal; marla; feddan; dunam; qirat; mithqal; sa; mudd; arpent;
      verst; arshin; pood; morgen; rood; smoot; jiffy; shake; planck length; bit; kilobyte; megabyte; gigabyte;
      terabyte; pixel; point; pica; em; baud; rpm; kph|kilometres per hour; mph|miles per hour
    `,
  },
  {
    id: "code-lang", titleCase: true, theme: "Science", text: "Name a programming language",
    answers: `
      Python=30; Java=15; JavaScript=14|js; C=6; C++=6|cplusplus|cpp; HTML=3; C#=3|csharp|c sharp; SQL=2;
      ruby=2; swift=2; PHP=2; rust=1.5; go=1.5|golang; TypeScript=1.2|ts; kotlin=0.8; scratch=0.8; R=0.6;
      MATLAB=0.6; perl=0.5; assembly=0.5|asm; BASIC=0.5; fortran=0.4; COBOL=0.4; lua=0.4; dart=0.3; scala=0.3;
      haskell=0.3; visual basic|vb|vba|vb net; pascal; delphi; Objective-C; lisp; common lisp; scheme; racket;
      clojure; elixir; erlang; F#|fsharp; OCaml; standard ml|sml; prolog; smalltalk; ada; algol; APL; j; k; q;
      julia; nim; zig; crystal; d; v; odin; carbon; mojo; elm; PureScript; reason; ReScript; CoffeeScript;
      groovy; bash|shell; PowerShell; awk; tcl; rexx; forth; logo; simula; modula 2; oberon; eiffel; hack;
      solidity; vyper; move; cairo; verilog; VHDL; LabVIEW; ABAP; apex; RPG; JCL; PL/I; MUMPS; cobra; boo; io;
      self; brainfuck; whitespace; malbolge; befunge; LOLCODE; shakespeare; chef; piet; ArnoldC; gleam; roc;
      unison; idris; agda; coq|rocq; lean; isabelle; mercury; curry; clean; miranda; hope; SAS; SPSS; stata;
      GDScript; HLSL; GLSL; WGSL; CUDA; OpenCL; SYCL; haxe; ActionScript; processing; arduino; MicroPython;
      jython; IronPython; PyPy; mathematica|wolfram language; maple; maxima; octave; scilab; PostScript;
      TeX|latex; XSLT; GraphQL; PRQL; kusto|kql; DAX; regex
    `,
  },

  // ---------------- Everyday ----------------
  {
    id: "colour", theme: "Everyday", text: "Name a colour",
    answers: `
      blue=28; red=20; green=12; purple=7; yellow=6; black=4; pink=4; orange=4; white=3; brown=2;
      grey=1.5|gray; turquoise=1; teal=1; navy=0.8|navy blue; violet=0.6; maroon=0.6; magenta=0.5; gold=0.5;
      silver=0.5; beige=0.4; lavender=0.4; cyan=0.4; indigo=0.4; lilac=0.3; crimson=0.3; scarlet=0.3;
      burgundy=0.3; olive=0.3; mint=0.3; peach=0.3; coral=0.3; cream; ivory; tan; khaki; mustard; ochre; amber;
      bronze; copper; rust; terracotta; sienna; umber; taupe; mauve; plum; fuchsia; cerise; rose; salmon;
      apricot; tangerine; lime; chartreuse; emerald; jade; sage; forest green; aquamarine; aqua; cerulean;
      cobalt; azure; sapphire; ultramarine; periwinkle; royal blue; sky blue; baby blue; powder blue; slate;
      charcoal; ebony; jet; onyx; pewter; platinum; champagne; ecru; eggshell; vermilion; carmine; cinnabar;
      puce; chestnut; mahogany; sepia; auburn; amethyst; orchid; thistle; heliotrope; byzantium;
      aubergine|eggplant; wine; oxblood; cardinal; ruby; garnet; claret; raspberry; cherry; blush; nude; mocha;
      coffee; caramel; honey; lemon; canary; saffron; marigold; butterscotch; sand; fawn; buff; celadon;
      viridian; malachite; seafoam; pistachio; avocado; moss; hunter green; bottle green; racing green; petrol;
      prussian blue; denim; steel blue; cornflower; ice blue; duck egg; eau de nil; gamboge; smalt; zaffre;
      falu red; xanadu; glaucous; coquelicot; wenge; isabelline; liver; bistre; fulvous; razzmatazz; bole;
      amaranth; atomic tangerine; neon green; hot pink; bubblegum; millennial pink;
      International Klein Blue|klein blue; tyrian purple; hookers green; payne's grey|paynes grey;
      davy's grey|davys grey
    `,
  },
  {
    id: "gem", theme: "Everyday", text: "Name a gemstone",
    answers: `
      diamond=30; ruby=20; emerald=15; sapphire=12; amethyst=5; pearl=3; opal=3; topaz=2; jade=2; garnet=1.5;
      turquoise=1.2; aquamarine=1; onyx=0.8; quartz=0.8|rose quartz; peridot=0.6; tanzanite=0.5; amber=0.5;
      citrine=0.5; tourmaline=0.4; lapis lazuli=0.4|lapis; obsidian=0.3; moonstone=0.3; jasper; agate;
      carnelian; bloodstone; malachite; alexandrite; spinel; zircon; morganite; kunzite; beryl; chrysoberyl;
      cats eye; tigers eye|tiger eye; aventurine; chalcedony; chrysoprase; sardonyx; jet; coral; iolite;
      tsavorite; demantoid; benitoite; painite; taaffeite; grandidierite; musgravite; red beryl|bixbite;
      jadeite; nephrite; larimar; labradorite; sunstone; rhodochrosite; rhodonite; sodalite; fluorite;
      amazonite; hematite; pyrite; howlite; moissanite; cubic zirconia; ametrine; prasiolite|green amethyst;
      smoky quartz; rutilated quartz; padparadscha; paraiba tourmaline|paraiba; watermelon tourmaline;
      rubellite; indicolite; heliodor; goshenite; andalusite; kyanite; sphene|titanite; diopside; apatite
    `,
  },
  {
    id: "shoe", theme: "Everyday", text: "Name a type of shoe",
    answers: `
      sneaker=24|trainer|running shoe|tennis shoe; boot=14; sandal=12; high heel=10|heel|stiletto;
      flip flop=6|thong|jandal; slipper=5; loafer=4; flat=2|ballet flat|ballerina; crocs=2|croc; oxford=1.5;
      brogue=1; clog=1; moccasin=1; espadrille=0.8; mule=0.8; slide=0.8;
      wellington=0.8|welly|wellies|rain boot|gumboot; cowboy boot=0.6; chelsea boot=0.6; ugg=0.5|ugg boot;
      pump=0.5; wedge=0.5; platform=0.4; derby=0.4; monk strap=0.3; boat shoe=0.3|deck shoe;
      cleat=0.3|football boot; ski boot; hiking boot; combat boot; Doc Martens|dr martens|docs;
      desert boot|chukka; work boot; steel toe boot; riding boot; knee high boot; thigh high boot;
      ankle boot|bootie; snow boot; mukluk; galosh|overshoe; kitten heel; slingback; peep toe; Mary Jane;
      t bar; court shoe; dorsay; gladiator sandal; birkenstock; huarache; jelly shoe|jelly; geta; zori; waraji;
      tabi; jutti|mojari; kolhapuri; paduka; khussa; peshawari chappal|chappal|chappals; klompen; sabot;
      opanak; lapti; valenki; bast shoe; plimsoll|plimsole; canvas shoe; skate shoe; basketball shoe;
      spike|running spike; climbing shoe; cycling shoe; bowling shoe; tap shoe; pointe shoe; jazz shoe;
      dance shoe; golf shoe; wrestling shoe; water shoe; barefoot shoe|minimalist shoe; orthopedic shoe;
      platform sneaker; creeper; winklepicker; spectator shoe; saddle shoe; wingtip; penny loafer;
      tassel loafer; driving shoe; slip on; velcro shoe; light up shoe; heelys; roller skate; ice skate;
      snowshoe; flipper|fin; stiletto boot
    `,
  },
  {
    id: "tool", theme: "Everyday", text: "Name a tool you'd find in a toolbox",
    answers: `
      hammer=32; screwdriver=22; wrench=10|spanner; pliers=8; tape measure=5|measuring tape; saw=4|handsaw;
      drill=3; level=2|spirit level; screw=1; nail=1; allen key=1|hex key|allen wrench;
      utility knife=1|box cutter|stanley knife; chisel=0.8; file=0.6; clamp=0.6; mallet=0.5;
      socket wrench=0.5|ratchet|socket set; adjustable wrench=0.4|monkey wrench|shifter;
      vise grip=0.4|locking pliers|mole grips; wire cutter=0.4|wire cutters|snips; hacksaw=0.4;
      crowbar=0.4|pry bar; flashlight=0.3|torch; sandpaper=0.3; tape=0.3|duct tape|electrical tape; pencil=0.3;
      stud finder=0.2; square|try square|speed square; caulk gun|caulking gun; staple gun;
      glue gun|hot glue gun; soldering iron; multimeter; voltage tester; wire stripper; crimper;
      needle nose pliers; channel lock pliers|tongue and groove pliers; pipe wrench; torque wrench; nut driver;
      torx driver; bit set|drill bits; awl; bradawl; nail set; punch|center punch; scraper; putty knife;
      trowel; float; plane|hand plane; spokeshave; rasp; coping saw; jigsaw; tenon saw; pull saw; mitre box;
      sliding bevel; marking gauge; chalk line; plumb bob; feeler gauge; caliper|vernier caliper; micrometer;
      magnet; magnetic pickup tool; inspection mirror; headlamp; gloves; safety glasses|goggles; ear defenders;
      dust mask; tin snips; bolt cutters; cable ties|zip ties; wd 40; pipe cutter; tube bender; hex driver;
      impact driver; circular saw; angle grinder; heat gun; rivet gun|pop rivet; tap and die; ball peen hammer;
      claw hammer; sledgehammer; rubber mallet; dead blow hammer; nail puller|cats paw; wonder bar;
      drywall saw; stud punch
    `,
  },
  {
    id: "transport", theme: "Everyday", text: "Name a way to get from one place to another",
    answers: `
      car=30; bus=14; train=12; plane=10|airplane|aeroplane; bike=8|bicycle|cycling; walk=6|walking|on foot;
      boat=3; taxi=3|cab; motorcycle=2|motorbike; subway=2|metro|underground|tube; helicopter=1.5; scooter=1.5;
      ship=1; tram=1|streetcar; skateboard=0.8; ferry=0.8; run=0.6|running|jog; uber=0.4|rideshare|ride share;
      horse=0.6|horseback|horse riding; truck=0.4|lorry; van=0.3; rollerblade=0.3|inline skate|roller skates;
      e scooter=0.3|electric scooter; hot air balloon=0.3|balloon; rocket=0.3; spaceship=0.2|spacecraft;
      cable car|gondola; funicular; monorail; light rail; high speed rail|bullet train|shinkansen; maglev;
      hyperloop; sleeper train; canoe; kayak; rowing boat|rowboat; sailboat|sailing|yacht; dhow; abra;
      gondola boat; punt; raft; jet ski; hovercraft; hydrofoil; submarine; cruise ship; paddle board|sup;
      surfboard; swim|swimming; zipline; parachute; paraglider|paragliding; hang glider; glider;
      blimp|airship|zeppelin; seaplane; jetpack; drone; segway; hoverboard; unicycle; tandem; rickshaw;
      tuk tuk|auto rickshaw; pedicab|cycle rickshaw; jeepney; matatu; dolmus|dolmush; songthaew; boda boda;
      chicken bus; minibus; coach; trolleybus; double decker; school bus; ambulance; fire engine; police car;
      limousine|limo; carriage|horse and carriage; stagecoach; camel; elephant; donkey; mule; llama;
      dog sled|dogsled; reindeer sled; sleigh; snowmobile; skis|skiing; snowboard; ice skates|skating;
      toboggan|sled; ski lift|chairlift; elevator|lift; escalator; travelator|moving walkway|moving sidewalk;
      wheelchair; mobility scooter; pogo stick; stilts; crawl; hitchhike|hitchhiking; carpool; piggyback;
      teleport; quad bike|atv; golf cart|golf buggy; go kart; tractor; tank; jeep|4x4; dune buggy;
      pickup truck; rv|motorhome|camper van; caravan; motor scooter|moped; vespa; electric bike|e bike|ebike;
      cargo bike; penny farthing; recumbent bike; handcar|pump trolley; mine cart; luge; bobsled|bobsleigh;
      catapult; cannon; slide; trampoline
    `,
  },
];
