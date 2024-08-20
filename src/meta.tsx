import { Helmet } from "react-helmet";
import { useSelector } from 'react-redux'
const FACEBOOK_PIXEL = import.meta.env.VITE_FACEBOOK_PIXEL
const GOOGLE_ANALYTICS = import.meta.env.VITE_GOOGLE_ANALYTICS

const Meta = () => {
  const { cart } = useSelector((state: any) => state.checkoutApp)
  const productSchema = cart?.products.length > 0 ? {
    '@context': 'http://schema.org',
    '@type': 'Product',
    name: cart?.products[0].name ? cart?.products[0].name : cart?.products[0].title,
    description: cart?.products[0].description,
    image: cart?.products[0].image ? cart?.products[0].image : cart?.products[0].images[0].url,
    sku: cart?.products[0].sku ? cart?.products[0].sku : cart?.products[0].id,
    brand: {
      "@type": "Brand",
      name: "CREABOX"
    },
    offers: {
      '@type': 'Offer',
      url: window.location.href,
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
      price: cart?.products[0].value ? cart?.products[0].value : cart?.products[0].priceTaxIncl,
      priceCurrency: 'BRL',
    },
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: {
        "@type": "MonetaryAmount",
        value: cart?.products[0].value ? cart?.products[0].value : cart?.products[0].priceTaxIncl,
        currency: "BRL"
      },
      shippingDestination: {
        "@type": "DefinedRegion",
        addressCountry: "BRL"
      },
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: {
          "@type": "QuantitativeValue",
          minValue: 5,
          maxValue: 15,
          unitCode: "DAY"
        },
        transitTime: {
          "@type": "QuantitativeValue",
          minValue: 5,
          maxValue: 15,
          unitCode: "DAY"
        }
      }
    }
  } : null
  const websiteSchema = {
    '@context': 'http://schema.org',
    '@type': 'WebSite',
    name: 'Primeiro e Único Clube de Assinatura de Creatina do Brasil',
    url: window.location.href,
    image: 'https://firebasestorage.googleapis.com/v0/b/pay-checkout.appspot.com/o/images%2Fcreabox-head.jpeg?alt=media&token=49b81b28-0800-4c14-96b7-b74a00dfd685',
    description: 'Primeiro e Único Clube de Assinatura de Creatina do Brasil. A Creabox é um clube de assinatura de creatina e fitness que entrega, diretamente na sua casa, não só a creatina de marcas renomadas, mas também uma seleção de suplementos, snacks saudáveis, itens fitness, além de acesso a uma comunidade exclusiva, clube de vantagens, treinos e desafios exclusivos.',
    publisher: {
      '@type': 'Organization',
      name: 'DS3I - Desenvolvimento de Aplicativos e Sistemas',
      slogan: 'Desenvolvimento de soluções digitais para o seu negócio',
      logo: 'https://www.ds3i.com.br/images/logo/azul.svg',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+5541999601055',
        contactType: 'customer service'
      },
      address: {
        '@type': 'PostalAddress',
        addressCountry: "BR",
        addressRegion: "PR",
        addressLocality: 'Curitiba, Paraná',
        postalCode: '81560-460',
        streetAddress: 'R. Eurídes Maciel de Almeida, 192 - Uberaba'
      },
      member: {
        '@type': 'Organization'
      },
      alumni: {
        '@type': 'Person',
        name: 'Francisco Freitas Jr'
      },
      url: 'https://www.ds3i.com.br',
      email: 'francisco@ds3i.com.br',
      telephone: '+5541999601055',
      image: [
        'https://firebasestorage.googleapis.com/v0/b/apps-ds3i.appspot.com/o/123244219_1721507951345044_3679130470784341172_n.png?alt=media&token=3440767f-8615-4e56-945c-7b194f2f9697',
        'https://firebasestorage.googleapis.com/v0/b/apps-ds3i.appspot.com/o/123244219_1721507951345044_3679130470784341172_n.png?alt=media&token=3440767f-8615-4e56-945c-7b194f2f9697'
      ],
      sameAs: [
        'https://www.facebook.com/OficialDs3i/',
        'https://twitter.com/OficialDs3i/',
        'https://www.linkedin.com/company/ds3i/',
        'https://www.instagram.com/ds3i_/'
      ]
    },

  }
  const organizationSchema = {
    '@context': 'http://schema.org',
    '@type': 'Organization',
    name: 'DS3I - Desenvolvimento de Aplicativos e Sistemas',
    slogan: 'Desenvolvimento de soluções digitais para o seu negócio',
    logo: 'https://www.ds3i.com.br/images/logo/azul.svg',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+5541999601055',
      contactType: 'customer service'
    },
    "address": {
      "@type": "PostalAddress",
      streetAddress: "R. Eurídes Maciel de Almeida, 192 - Uberaba",
      addressLocality: "Curitiba",
      addressCountry: "BR",
      addressRegion: "PR",
      postalCode: "81560-460"
    },
    url: 'https://www.ds3i.com.br',
    email: "francisco@ds3i.com.br",
    telephone: '+5541999601055',
    image: [
      'https://firebasestorage.googleapis.com/v0/b/apps-ds3i.appspot.com/o/123244219_1721507951345044_3679130470784341172_n.png?alt=media&token=3440767f-8615-4e56-945c-7b194f2f9697',
      'https://firebasestorage.googleapis.com/v0/b/apps-ds3i.appspot.com/o/123244219_1721507951345044_3679130470784341172_n.png?alt=media&token=3440767f-8615-4e56-945c-7b194f2f9697'
    ],
    sameAs: [
      'https://www.facebook.com/OficialDs3i/',
      'https://twitter.com/OficialDs3i/',
      'https://www.linkedin.com/company/ds3i/',
      'https://www.instagram.com/ds3i_/'
    ]
  };
  return (
    <Helmet>
      {/* Metatags do Facebook */}
      <meta property="og:title" content={'Primeiro e Único Clube de Assinatura de Creatina do Brasil'} />
      <meta property="og:description" content={'Primeiro e Único Clube de Assinatura de Creatina do Brasil. A Creabox é um clube de assinatura de creatina e fitness que entrega, diretamente na sua casa, não só a creatina de marcas renomadas, mas também uma seleção de suplementos, snacks saudáveis, itens fitness, além de acesso a uma comunidade exclusiva, clube de vantagens, treinos e desafios exclusivos.'} />
      <meta property="og:image" content={'https://firebasestorage.googleapis.com/v0/b/pay-checkout.appspot.com/o/images%2Fcreabox-head.jpeg?alt=media&token=49b81b28-0800-4c14-96b7-b74a00dfd685'} />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:type" content="website" />
      {/* Metatags do Google */}
      <meta itemProp="name" content={'Primeiro e Único Clube de Assinatura de Creatina do Brasil'} />
      <meta itemProp="Primeiro e Único Clube de Assinatura de Creatina do Brasil. A Creabox é um clube de assinatura de creatina e fitness que entrega, diretamente na sua casa, não só a creatina de marcas renomadas, mas também uma seleção de suplementos, snacks saudáveis, itens fitness, além de acesso a uma comunidade exclusiva, clube de vantagens, treinos e desafios exclusivos." content={'Primeiro e Único Clube de Assinatura de Creatina do Brasil. A Creabox é um clube de assinatura de creatina e fitness que entrega, diretamente na sua casa, não só a creatina de marcas renomadas, mas também uma seleção de suplementos, snacks saudáveis, itens fitness, além de acesso a uma comunidade exclusiva, clube de vantagens, treinos e desafios exclusivos.'} />
      <meta itemProp="image" content={'https://firebasestorage.googleapis.com/v0/b/pay-checkout.appspot.com/o/images%2Fcreabox-head.jpeg?alt=media&token=49b81b28-0800-4c14-96b7-b74a00dfd685'} />
      {/* Pixel do Facebook */}
      <script id="facebook-pixel-script">
        {`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod ?
          n.callMethod.apply(n, arguments) : n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${FACEBOOK_PIXEL}');
        fbq('track', 'PageView');
        `}
      </script>
      <noscript>
        {`<img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id=${FACEBOOK_PIXEL}&ev=PageView&noscript=1" />`}
      </noscript>
      {/* Google Analytics */}
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS}`} />
      <script>
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GOOGLE_ANALYTICS}');
        `}
      </script>
      {/* JSON-LD para o organization */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      {/* JSON-LD para produtos */}
      {productSchema &&
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      }
      {/* JSON-LD para o site */}
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
    </Helmet>
  );
};

export default Meta;