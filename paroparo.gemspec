# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = "paroparo"
  spec.version       = "1.0.0"
  spec.authors       = ["iltruma"]
  spec.email         = ["cosimo@paroparo.it"]

  spec.summary       = "Paroparo"
  spec.homepage      = "https://paroparo.it"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r!^(_assets|_layouts|_includes|_sass|LICENSE|README|_config\.yml)!i) }

  spec.add_runtime_dependency "jekyll", "~> 4.2"
  spec.add_runtime_dependency "jekyll-spaceship", "~> 0.9.7"
  spec.add_runtime_dependency "jekyll-sass-converter", "~> 2.0"
  spec.add_runtime_dependency "jekyll-watch"
  spec.add_runtime_dependency "jekyll-get-json"
  spec.add_runtime_dependency "jekyll-seo-tag"
  spec.add_runtime_dependency "jekyll-sitemap"
  spec.add_runtime_dependency "jekyll-feed"
  spec.add_runtime_dependency "rouge"
  spec.add_runtime_dependency "jekyll-paginate-v2"
  spec.add_runtime_dependency "jekyll-email-protect"
end
