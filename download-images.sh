#!/bin/bash
# Downloads all real product/nutrition-label photos used by cereals.html into
# a local ./images folder, so the site no longer depends on hotlinking to
# Kellogg's, Slurrp Farm, or Bagrry's own CDNs.
#
# Run this from the same folder as cereals.html (the one this script is in):
#   chmod +x download-images.sh
#   ./download-images.sh
#
# It needs normal internet access — it will NOT work inside a sandboxed or
# network-restricted environment. Run it on your own laptop/desktop.
#
# After it finishes, cereals.html already references these exact local paths
# (images/<name>.ext) — no further code changes needed.

set -e
mkdir -p images
cd images

echo "Downloading 19 product images..."

curl -sS -L -o "multigrain-chocos-more-chocolatey-front.png" \
  "https://images.kglobalservices.com/www.kelloggs.in/en_in/product/product_2501750/prod_img-939867_en_in_8901499010728_2608201107_p_1.png"
curl -sS -L -o "multigrain-chocos-more-chocolatey-back.jpg" \
  "https://images.kglobalservices.com/www.kelloggs.in/en_in/productitemnutrition/product_2501750/nutlabel-2720449_en_in_08901499010728_2509151235_n_1.jpg"

curl -sS -L -o "corn-flakes-original-front.png" \
  "https://images.kglobalservices.com/www.kelloggs.in/en_in/product/product_2501740/prod_img-940037_en_in_08901499008893_2606111119_p_1.png"
curl -sS -L -o "corn-flakes-original-back.png" \
  "https://images.kglobalservices.com/www.kelloggs.in/en_in/productitemnutrition/product_2501740/nutlabel-2720454_en_in_08901499008893_2605141006_n_1.png"

curl -sS -L -o "slurrp-farm-choco-crunch-front.jpg" \
  "https://slurrpfarm.com/cdn/shop/files/1_Chocolate-Crunch_D2C_1500x1500_aec18ce4-038c-48b4-9b3d-08dc4895cb18.jpg"
curl -sS -L -o "slurrp-farm-choco-crunch-back.jpg" \
  "https://slurrpfarm.com/cdn/shop/files/2_Chocolate-Crunch_D2C_1500x1500_55b6934b-3ba3-472b-9be5-f0425d2d27f3.jpg"

curl -sS -L -o "almonds-honey-corn-flakes-front.png" \
  "https://images.kglobalservices.com/www.kelloggs.in/en_in/product/product_2501741/prod_img-5547048_en_in_08901499008343_2606111122_p_1.png"
curl -sS -L -o "almonds-honey-corn-flakes-back.png" \
  "https://images.kglobalservices.com/www.kelloggs.in/en_in/productitemnutrition/product_2501741/nutlabel-2720451_en_in_08901499008343_2605141434_n_1.png"

curl -sS -L -o "bagrrys-corn-flakes-plus-front.jpg" \
  "https://bagrrys.com/cdn/shop/files/1_9_7033f41b-7f0e-49e9-9a76-51fff045763c.jpg"

curl -sS -L -o "multigrain-chocos-moons-stars-front.png" \
  "https://images.kglobalservices.com/www.kelloggs.in/en_in/product/product_2501757/prod_img-940016_en_in_8901499010773_2608201110_p_1.png"

curl -sS -L -o "multigrain-chocos-crunchy-bites-front.png" \
  "https://images.kglobalservices.com/www.kelloggs.in/en_in/product/product_2501755/prod_img-939964_en_in_8901499010742_2608201114_p_1.png"

curl -sS -L -o "froot-loops-front.png" \
  "https://images.kglobalservices.com/www.kelloggs.in/en_in/product/product_842566/prod_img-940332_in_08901499011176_2202030852_p_1.png"
curl -sS -L -o "froot-loops-back.png" \
  "https://images.kglobalservices.com/www.kelloggs.in/en_in/productitemnutrition/product_842566/nutlabel-842937_in_8901499011176_n_1.png"

curl -sS -L -o "multigrain-plus-corn-flakes-front.png" \
  "https://images.kglobalservices.com/www.kelloggs.in/en_in/product/product_7156697/prod_img-7157958_en_in_08901499027511_2602211000_p_1.png"
curl -sS -L -o "multigrain-plus-corn-flakes-back.png" \
  "https://images.kglobalservices.com/www.kelloggs.in/en_in/productitemnutrition/product_7156697/nutlabel-7157988_en_in_08901499027511_2602271000_n_1.png"

curl -sS -L -o "real-honey-corn-flakes-front.png" \
  "https://images.kglobalservices.com/www.kelloggs.in/en_in/product/product_2501743/prod_img-940055_en_in_08901499008695_2606111126_p_1.png"
curl -sS -L -o "real-honey-corn-flakes-back.png" \
  "https://images.kglobalservices.com/www.kelloggs.in/en_in/productitemnutrition/product_2501743/nutlabel-2720453_en_in_08901499008695_2605141502_n_1.png"

curl -sS -L -o "chocos-fills-double-chocolaty-front.png" \
  "https://images.kglobalservices.com/www.kelloggs.in/en_in/product/product_6661876/prod_img-939995_en_in_08901499009623_2508221748_p_1.png"
curl -sS -L -o "chocos-fills-double-chocolaty-back.jpg" \
  "https://images.kglobalservices.com/www.kelloggs.in/en_in/productitemnutrition/product_6661876/nutlabel-6661881_en_in_08901499009623_2508221748_n_1.jpg"

cd ..
echo ""
echo "Done. Checking for any failed downloads (should all be real image files, not tiny error pages):"
find images -type f -size -2k -exec echo "  WARNING - looks too small, may have failed: {}" \;
echo ""
echo "Total files downloaded: $(find images -type f | wc -l) (expect 19)"
echo "cereals.html already points to these exact filenames — no further changes needed."
