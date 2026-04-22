import Head from 'next/head';

export default function PacmanPage() {
  return (
    <>
      <Head>
        <title>Pac-Man | UncensoredCode</title>
        <meta name="description" content="Classic Pac-Man game built with vanilla JavaScript and Canvas API." />
      </Head>
      <div style={{margin:0,padding:0,background:'#000',minHeight:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}>
        <iframe 
          src="/projects/pacman/index.html" 
          style={{width:820,height:900,border:'none'}}
          title="Pac-Man"
        />
      </div>
    </>
  );
}
