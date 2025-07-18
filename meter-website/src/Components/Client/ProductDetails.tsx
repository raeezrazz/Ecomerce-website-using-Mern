import React from "react";
import { Star, Heart, ShoppingCart, Zap } from "lucide-react";

const ProductDetails = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-9 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Left: Product Images */}
      <div className="space-y-4">
        <div className="relative">
          <img
            src="data:image/jpeg;base64,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kfGRVWBsoN+JMqPBlLzr3QzqhpY3B08RiKuIpVKt2CoaYUUyfzZIZCbka7+ImRxHURRPoY6sv2qdN/uKybHEAbay4CZhcfHmP7TqmJ6iK4/R4+m326LJ9ztMRiuqPaeGu6djWA4U2OY/BgPleNq0ClVemcyMyNYjMrFTY6EXHA8pmcPtyk4AxFDl+coZKbG3tUmBpnj6OTeecgxeGAYrVRqNQaEMpXXxU8fIy1qbPcagBhzU/SOpGYTCYWqO5jUU+zXSrRNu764DpfRuO9vCXC7LqV+4mKwmUWLA4lFQkCy2sLm3e37r+M1ZhbQ3B8QRPS25iNS3buZ2Y3H2v9NuTonTX9NtLA0/BX7U+V1mSwlHY2G1Zq2NcbgVK0r8spCgj3lpoi29pR8fwnrt0GpbyB+tp16OG57a6fYiqvZ0QuGpWsFp+nl5Z7DL+6B75qoGhYkKu8sTx3nxJ+c2Ho/0J2hjrGjheypn9diLoluaoRdvgrCdQ6L9UeFw5FTFscZWG4OLYdfs0rnN+8SPASXI05t0L6D4nahBUNQwl+/iGFnqDitFTvB57uZPoz6A2DsWhgaK0MOgSmvmx4sx9ZjxMv1UAWAsBuHCVnKkREBERAREQEREBERAREQExHSjo5Q2jQNGuDa91YaOjDcymZeIHz/tbqUxiOexelVS+hJyPb9oHTyvM30P6mMlRamNdGVTcUUuQxG7tG5eA3zssQKKoAsBYDcOErEQEREDF7b6O4XGi2IoJUtuY3DjwDrZgPcZpe0OpzBOb0ategeQYOg+BF/nOkRA5BV6na40XHqw/boD6NIafUtVJ7+Lw9vDC6/1BOyxJocy2f1L4RDerWqVP2VSjTT5KW8mm3bE6GYHB2NHDUw43O16lQe53JI+Ez8ShERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERA//2Q=="
            alt="Product"
            className="w-full h-[400px] object-contain rounded-xl shadow-sm border border-gray-300"
          />
          {/* Optional zoom effect on hover */}
        </div>
        <div className="flex gap-3">
          {["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRq5MIAhuHeo6sil4VgHBwNaS1zkWdeD3uZ5g&s", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgJNe699mgxCdFHB6PRPZqb4ALbpIvYIsmQQ&s", "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUSEhIVFRUVFRUVFRUXFRUVFxUVFRUXFhUVFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0NFQ8QFSsZFR0tNy0tKy0rLSstLSsrLSstKy0tLS0rLS0tLTcrKy0tLS03KzctLTc3LSs4NyswKzctK//AABEIAOEA4QMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAACAAEDBAUGBwj/xABAEAACAQIDBQUEBwcEAgMAAAABAgADEQQSIQUGMUFRImFxgZETMqGxBxRCUnLB0SMzYoKS4fCissLxFkMVF9L/xAAYAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/EACgRAQEBAAEDAQYHAAAAAAAAAAABERICAyExMkFRcYGxBBMjYZGy8P/aAAwDAQACEQMRAD8A7siCRJCsEiZVERBtJSIxWBFaMVkuWLLAgyxZZLlj5ZRDaLLJssQWBFkiySbLHAkRBkj5ZPaILCogsILJcscLAjCwwsILDCwBCw1EILCCwhKJIsSiGBAQhARAQwICEMCMBCAhRAQgIwEMShooUUDFKwCsnIgkSCHLBtJisErKIssbLJssbLIIrRWkuWLLAiyx8skyx8sojyxZZJlj5ZBFaOBJbRBYABY+WSBY4WAIWEFhhYQWAIWEFhhYQWAIWGFhBYYEIHLHCwwI4EKbLCCwgI4EBssILHAhAQGtFCtFAxyIJEktGtKiK0VpJaNaFR2itJLRWgR5YgsktFaBHaPlkmWPaBFaFlh2jgQACx8kMLCywiIJDCQwsICQAEhBJIFjgQoAsMLCAhAQBCwssMCFaBHaEBCtHAgMBHAhWjgQGAhgRARxAVo0KKBjkQbSUiDaVEdo1pIRGtChtGtCtHyygbRWhWj5YAgR7QgI9pANo9oYEe0AAIVoQELLAC0ICGBE1gCSQANSToAOpPKQMBCAnJ7Y+kLBULhGNdhyp2K+dQ6el5yG0PpZrn91Rp0x35qjevZHwlxNeuAQwJ4DiPpN2gT+/t3KlMfJbysPpL2gD+/f4fpNcKnKPokCPaeCYP6W8avvNmH8S0z8lB+M6fZX0wqbCtRXxUlD6HMD6iL0WHKPVAIVpgbG3ywWJsErBWP2Xspv0BvlJ7gZ0Ey0QiihCQNCEUQgKKPFAyyI1pJaMRAjtGtJLRWlEdorSS0VoEdo4WSZYrQAAjgQ7RwsgELHAh2j2lAgQrR8syN6tvJgqPtDZna60k+83U2+yNCfIcxAj3m3loYFL1O07e5SU9pu8/dXvPlfhPIN4t5cTjCfavZL9milwg6XH2j3nylLaeOetUarVYtUc3Zj8h0AHACUWxH2VF2mpGLUOIWw1NpnO4PC58JuYPYFWs2oZieQF7eJ4LOjoblOq5mCKBqbksQOeg04X5zWpjz32LHl8RGbCt0+I/WeoLu7h10OKp/yhPlc9RENh0CNMSoOlwcuh1FuI5gjyMczHlTYNx9k+Wsi+B9J6md2i4JVqbi5HobX0vMrH7u20dCP9Q9f7zXM4uMw1d1OhInd7p/SHicNZS3tKf3G1Fv4TxTy07pzOL2Gyarw6cR+olfDgA2Iseh/LrFypPD6T3b3lw+NW9JrOBdqbWzL3j7w7x8JtCfNOAxb0HWpSYqym4INrHxntu4+9641Mj2Wuo1HAOBxZRyPUeY04crMbldXaICOBHEyprRQooGbaMRJCINoUForQ7RBYAWj2lfGbRoUf3tanT/HUVfmZhYzf/ZtPQ4kMeiK7/FVt8ZUdNaK08+xn0t4Rf3dCs/Qtkpg+eYn4TBxn0w1j+7w9JOhZ2qf7csuU17ABHIt3TwLE/SbtCqcq1wh6Uqa3+IJlN8ftGvqz4tvAOo+OQfGMNfQNfaFFNWqoPO/ymPi9+Nn09DiEJ6Blv6E3+E8XpbuvU1q+0B6u1IH/e5mrs/clH95l8qhPyVY8Gu8xH0pYIaJdu+z/wD5A+M8+3o3jfHVWrHRB2Kai9gg6C/E6k+PcJY3l3Xw2EwzVM16mgQXPEkAmxJ4C58plHDBKVvuqPM8/jHhLWVSV6r5E4niegne7G3PWhT9rW4DVlJsSPHk38PPhz02vo/3KFOiMTXWzHtLfit+Y7+QH6y5tfZ1Su2pIUe6o+ZtxPf6cpdRg7S3gCfssPTChTxsOXAheAF/G/doZgYitXqm7ux6XJNtLadOfC3GegLsZRQFLIbjW9yBcsSSQDZtAg1GmWQpu/3SaOS2psoIwUFi4v7W7BgHzcFYKL6AX04+EjwezSzot7ZmVSb2AuQLk8rX4z0Chu8EszKSfsqCFGgBzM3TUaac9RzlxW7yElVUo1zl1uG6Ag6gnuNr8rayjhtq4MU3ApMT2BrmzkE6AXtoQoQW5Ed2h4balVPe7Q531Prx+PSdA+xT0iwmzzTfNbkw4XNmBU21FjYnW+kgyhhaVc9m1NrcPvH/AC3Q68JgbZ3ZP3bNyI4H8J5GdbjcFmqO4GXMxIHQE6Dyl7CAOMlXXkCf8+P/AHG4uPG2D02yVBryPDN/ful/Ze0Go1FqIxVlNwRxBHMf5853G9W6y1FIHvDUEcdOB8R8RPNCGUlGFmU5WHeOY7jxm55Z9H0rutttcZQWqLBhpUXo3Udx4j05TZAnhf0X7wGhilRj+zrWpt0BJ7DeR+DGe6Cc7MalPGjxSKyNo42nQptVquFRQSSe7XQDiZ5jtf6XspK4fDC3JqrG/iUTh/VLG/e21q1cRh24U1NIcdGdAwbzN/QcJ5tgcMrkkgX0Nzr8/CakTW5i/pQ2jU0V1p91OkvzfMZi4vbW0K/v1q7A8mqMF/puBNXDbOvoBJVw4BsRNeDHMJsyoeJUeGv5W+MtUdiE8Wc9wAX4m/ynUewIAuNJe2Ns5qhsojVxyabDprxpk/jdv+GWXKGAUarSpC3P2asfVwTOhx+EKMVPHpEMCQgvp5dZNMZDPVGmdgP4TlH+m0Y4ct7zE+JJ+cvvSzaCIjLoQbwM5cNY2tLSYax0JB7tJYfCm4K69kk8stlDkEnTRWUk9/dDFM9B1HaXWwzErr2gAQdL8YHO7da5RDcksGPhqJqbJpe2q0qfENVQH8INz8AZmY/DMcUEchLnidbBR2msNbXVtedjabW6eGtiqDVCAPrBplTytTqEsTwABRh4qekVmu33t3negwo0VpgKozKbkAkdkZQRaw1v/EOPKjtLemouQ0/Z3IOZLBihGgu6sVYmxOnC4lHbWG9pWZswIZ+z2l1zXK26jKB36d2lMYRRzuMrPdbNcKpbs2Nj7pHGMVf/APMMT91PQ/rAO9eKPNR/L/eUnoAEjTS1xcBgGCkXW9/tDug1Kdua8XBGdNMgBa+ulgdelje0DdwG9dSxWs1uJSoEzFCbA3TMMwsOtxx1l+vvMyAP7X2hK9lRTIXPmIDu7C6gH7IHIC+uvFNVF7C3iCCNO8cZo7OpA06xJ4AW8rt+knVcmuna7fPq4/P7L6bz1+YU+v6x/wDyepzRf88pjsLC/Lh5xlMrm6HA7wFqiK6KFLKGYsAAt+0eHIX0k+L2/SWmSqoX1svaJB9o48LZFQ/z85ziJJ6OANRgiC7E2A0Fz5xg3sBvIKqFGSmCuo1I0669/wA/Gea77ima6vTUrmBD8LXB7NiOP2telp1NLZ7ABraEkC1tSNTp4H4zG3uwf7LP903/AD/KJcrfCXpt98c5hbggz6U2Bjvb4ajWPF6alvxWs3xBnzS1UfCe/wD0c1L4CmOjVB/rLf8AKXqc+l08aPFObTxn6RNnZdpGw0xGHDjlepRureigTjqmEahiDSfj15G4Dgg8xY8Z6j9LVDKmFxY/9FcKx6U6oyn4hfWeabxY961UM3vU1CA6arT929u4kTUT3trC44U0OX3jz7pnvU1vI0NxeBUOmk01q5Vxl7AkaTqtzdvUKFy5U6dROewG5asoaoxJOp16zXw+6NEdfWZ5RNVtt7bovWLBhYm/X5Tfxm1sL9VHaBa3KVae7GHGuQGXqWyKIFsgk5QYu7eJpOxuD5iVNtv+1slJmF/Kdhh8HTXgoEnNJegjkMLDYB6lIsVuxDmzE2u6stgL9le1wHQTOqYKvqCoy68C4AGUKbANroo96/PrO3SpYWErYjUGOQ8g3hrN9auLFlRhwPBksFtfkGYDy42hYLajhkqaHKUvYWJCK6kXvxYVahJ43a+kHeLsV1c91/K6n0GvlKaDKxXkdR/n+cptmu6o7ZyVCxAdGy30t2VHZC2PAmxN7njKC4lmYksqnIy3s9gCGBta5v22N+p8pm4epdQDxGnly/zwmhXwrIi1LrZyQB2gwsATcEDTtDUXHHpI0mV8ot7RMup0WqSbkE6HKpOnE3Mj9qvEMxsWb92Rq1r2K1RbgPSU87dYsx6mBSxuJcPntqSSQBYa8u6b2wK2ahWPDx71ImBi1bqZe3cpM1DFrr2lVQO8hx+cx3PZen8Jf1fpftUtLHB+ytyBqSdLnkB3amXsPUI0svmik+pF5iYKiU0F/wA7zVpMwF7G2mtjz4azbyNnD1G7h4Ko+QlqjtQUqgLNdl1GYkgXFr8ZlYb2n3W9D0vJWwBrYinTYlM9wWy3tlBYkqSOQ6wL7Y2kwVQygAkjjzte+vcPSZe97IMJU1F7WHjwEoYjZwCKxJztlKpYNmVs3aABuBoOPG8xN56oWmidWvboB3DvMWeY7dv2er5OfTUgdTPoz6OktgKRtbMajeWcgfAAz562VhzUqKq8SQB4sbD5z6f2VghQo06K8KaKnjYan1vL1uMWrRRRTm05rfTAfWcFiKI1LU2y/jXtJ8QJ5Ds3Y74nC/W0N2poWqC+v7O4qG3E6G9v4p7bUaeOjG1MBWx2GQkDMzoLaGlWGo8AT8ZYlUMBh2dXK65TqB04i3+cpDUW0fdfaZpVLcVdSpvrw4fC/rL2KQXM0rucCOwvgPlLIkWCXsL4D5Se04oQjxo8sDgwgYEV5RJmkdRoxaA5kV5zvxhLMWtoCTbqG4j5znqDZ0yn3l59RyPn856PvNgfaISBqB8J5XVVqVSw4gm19Li/un8u/wATbrPMZrZwOJ1seI+Im/XxzVVQGwVLhVHAZjc8dTfvPKcHi8fla9iLcRwII8eBE2dl7VVh73df9ehlw1vBY1ukJdreww7im1T2riqj3BZMjhVFrVAAcvtO0Vb3hw4zm8LtBlPX4SK3aqS5sXSjXt0X85n4bE+0W/OaOzNKNb+T5mY7np/vi9P4Xx3Ppf61bxG0CjnIqAMLmwIzCoRUGa32gGy342J8Ydba9RwQbC+psOd1OnT3V9OtzKOINwh55MreKswF/wCXIPKJFm3maNHadW/vnXjaw/zifWS4yq4TOrsrDS6kqcpFrXHLgLShT0lnFYhVpEuQF0vf/OMiMwu1RgrVDlHNmOVFAuza6AAAmcpvLtQYnEF0WyCyUxaxyLwJ7zqfQcoW09ptUuiXCHj1YA3se64Bt3CWt2d3XxFQKNALFm5ID+ZnSeB2P0PbvZ631hwMlK5F+dTlb8PznsxMwd0MGlKiRTFkvkTvFO4LHvLl/QTdvOdu1Ye8eNFMqxqhnmH0mYMU8VhsVbs1D7Cr4H3TccOJ9BPTnnN787K+s4OrT+0BnXuZdREL6OB29u02Fp08SrBkZyumpRh2gCedxf8ApkpYOAy8Dr4d0o1MY9fDoxvovbHIOug05dPAzGp7xrTXKHXQniGJHXhNxJXsGB/dr+EfKTzyFvpDqgWWqABppSH/ACEpV9/cQ3/uq+WVP9szwpr2u0F2A4kDx0ng1Xeus+meq9+tVifTW8D22JYi2GqEsCV/Z1GLAWuRpqBceoj8tHuNbatBPer0l8aiD85Uq7yYReOIp+RLf7QZ4/XwG0EptVfCvTRASxamUIAsCSrnNzHLnLZ3W2jnFN/ZU2ap7IB6+GF3ugygKxJINSmDYGxcXl4T4j0qpvlgxwqFvCnU/MCU6u/WG+ylVv5UHzaeN4urUV2Q1CSrMt1Y5SVNrgjiNIy4aq/En1Jl4QeqYzfymQQKLH8ThfkDOJ2xtJKpJsinpnv+k598Ey8pDNTpkGhi6qstyRm4XBvmHfbn38/HjXpuVN1Nv85yFTCJ0mkdJgtouoFxcfLwlwVaVTXgfT+0xdmV7ixmiaQOpHnwPqJjVx1GH2kow1LD3bsVKzk8QfaBcoXXS2X1YmWcJiUWlUBYAtksDzsTecelMj3WPn/a0l9pV6g+f6iS9Mrp2+u9Ft/az+ZjvNnHCGkzVaq5/wBrlXOBbJTBTQcSzsB/KZjvtOkPtX7gCfjwnOD2h5fEQxhap45R4n9BGRzaeI26R7iebfoP1mLi8S9Q3diel+Av0HAS/R2Xf3n/AKR+Z/SbOz9n01IIUX+8dT5X4eUuyGM7Ym7r1CGe6L1PvH8K8vE/Gd9gqQphMNh1yvUNlt9kaB6rdbX4nnYTHqbQFOyqM1RvdQHU24k9FHMzs9x9kFAcTVOapU4Hlb+HoouQOtyeczarrMJQWmi0191FCjwAtJgZGphXmVHeKDeNAyWMr1eElYyJzCvIcdRbC4nEYcEhagFSn/UGPyM8tfiZ7t9IezriniADmpE3tqSpHCeJV2GYn2Vjc6dr5Tp0OdirNvdTa9HC1KjV8OK6vTyBSEOU+0QsRnBt2A401NxqOMzlzcqX+g/pJBSq8qQ/pAmqO7/+0URi1PCHVlYA1ggUjKGsAp5LYa2GY2A54VffrENYqvaUnK7O7uF+tfWsl1ygDMqKSAOygGkxFw+I+7b+kfnD+o4g8x6/2kyK3sX9IGOqKUNKiFIIy+xZ1KlQpBV2YN7oNzc35yhi96to1b56zasrkinSpnOrIwa6oCDmp0yTzyLe9hKA2VWPFx6n9IQ2M/OoPQn848CtSpMA9VhqDYX5s3/Ymk2VCEc6ZQbngzHmY9PAn2T08wJuGBtbXl/tEoVcbbsul7cjoV7vCPUWS4OYIbgKSOYBHTu7pSxdFey4IUOt7d/OIYkuMlNQL9PzPITT+pIQqML5V01I46cvD4x6DGFNfv8A+m/5xwE+8fS02V2fRH2fiT+cMYSl9wekaYyKNZUNwW87W+U3cPVBAINxGWig4IP6RI2oITe1u8dk+okqrykSZQJmrRYe7UPmAf0PxkqCr95D/KR+ZgaaKJYpqJkqtY8Cg8ifzEnTC1D71YjuUBfncyDVqYtKa3Zgo79INHG1amlFcq86jggfypxbzsO8yPZ2yFLjLTZmvoz3Zj+G929NJ6Ru3umBapXFyLFafIH+Lr4f9QK25G6YA9vVBOaxu3vVbcC3ROiiwN+FuPoSmRKJKsyowYQMAGEDICijXigYpMicyQiRsIVRx+HWojIwuGFj+o755PvHsZ8PUIIupPZe1gR+R7p7C6SpXpRqPFloseCk+AJgujDipHiCJ6tisKZmVsCTLo83qUXJBBYW5BePwh+ybo3pO7fZfdIzskdPhGmOI9g3QxewbofWdsNlDp8IQ2YOkmjiqNK17jiPGVsVg1bkD+IZreB0M9B/+LHSZ+I3TzG6OV7iMw8tRE6jHH4TBIvIeAFh5ybEUCWuAeHSdlgd1VQ5mJc8tLAeXOWquxieUcvJjz76s/Qwfq7d8707CboISbAPO0vJccHTwpPWW6WB8Z3CbBEsJsJekmmPORhnHGmfEKSPUSzhsGW+zbxzCeiU9hp0lqlsdOkcjHBUdksRdUDHkLnXzPCbGyt36rWzAIOYXU/K3nO0w+zQOU1MNhQOUuoo7F2QtP3VA7+fmZ0NKnaNSp2kwgOBCvBjyKKOIN4QMIKPAvFAyyINpMVglZFQFZDUSWysErCsutRlVsPNl6ciNKBkfVovqvdNX2UcUoGSMH3QlwU1hShClAyvqfdHGEmr7OL2cgzPq0X1aaRpwSkooDDQhhZdyQgkCmuFEkXDy2EhhYFVcPJUw8sBZIqwiOnSllEtEBCEoKPBjiA6mFeDHEAo8GPAKKDeKBWIjESQiK0iobRisltGtAhZJGUlkrBKwK+SLJJssVoREEj5ZJaLLAELGyyS0e0KhKRismIjZYEOWOFkhWLLAECGBHAhAQhgsMCOBHlCEeNFCCjwY4hRRQRCgPCvBvFeA8UHNHgCIxiikUxjRRQFGMUUADGjxQGMaPFAcRR4oQxiiihTCKPFAEcfIfMyQRRQghHiilCMaKKAo8aKA4hRRQHMGKKA0UUUD//Z"].map((i) => (
            <img
              key={i}
              src={`${i}`}
              alt={`Thumb ${i}`}
              className="w-20 h-20 object-contain rounded-lg border border-gray-300 cursor-pointer hover:ring-2 hover:ring-blue-400"
            />
          ))}
        </div>
      </div>

      {/* Right: Product Info */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Digital Speedometer - Honda Activa</h1>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex text-yellow-400">
            {[...Array(4)].map((_, i) => (
              <Star key={i} size={18} fill="currentColor" />
            ))}
            <Star size={18} className="text-gray-300" />
          </div>
          <p className="text-sm text-gray-500">(56 reviews)</p>
        </div>

        {/* Price */}
        <div className="text-xl font-bold text-blue-600">₹1,499</div>
        <p className="text-sm text-gray-500 line-through">₹1,999</p>
        <p className="text-sm text-green-600 font-semibold">25% OFF</p>

        {/* Description */}
        <p className="text-gray-700">
          High-precision digital meter compatible with Honda Activa models. Includes display, wiring, and backlight replacement. 6-month warranty included.
        </p>

        {/* Options */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-600">Color:</span>
            <button className="w-6 h-6 bg-black rounded-full border-2 border-gray-300" />
            <button className="w-6 h-6 bg-gray-600 rounded-full border-2 border-gray-300" />
          </div>

          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-600">Size:</span>
            <select className="border px-3 py-1 rounded-md">
              <option>Standard</option>
              <option>Small</option>
              <option>Large</option>
            </select>
          </div>

          {/* Stock Status */}
          <p className="text-green-600 text-sm font-medium">✅ In Stock - Ready to ship</p>

          {/* Quantity */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-600">Quantity:</span>
            <input
              type="number"
              min="1"
              defaultValue="1"
              className="w-16 px-2 py-1 border rounded-md text-center"
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 mt-4">
            <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow">
              <ShoppingCart size={18} /> Add to Cart
            </button>
            <button className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow">
              <Zap size={18} /> Buy Now
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border text-gray-600 rounded-lg hover:bg-gray-100">
              <Heart size={18} /> Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
