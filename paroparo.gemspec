# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = "paroparo"
  spec.version       = "0.1.0"
  spec.authors       = ["iltruma"]
  spec.email         = ["casini.cosimo@gmail.com"]

  spec.summary       = "Paroparo Project"
  spec.homepage      = "https://paroparo.it"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r!^(assets|_layouts|_includes|_sass|LICENSE|README|_config\.yml)!i) }

  spec.add_runtime_dependency "jekyll", "~> 4.2"
  spec.add_runtime_dependency "jekyll-spaceship", "~> 0.9.7"
  spec.add_runtime_dependency "jekyll-sitemap", "~> 1.4"
  spec.add_runtime_dependency "jekyll-paginate"
  spec.add_runtime_dependency "jekyll-feed"
  spec.add_runtime_dependency "jekyll-watch"
  spec.add_runtime_dependency "jekyll-get-json"
end
