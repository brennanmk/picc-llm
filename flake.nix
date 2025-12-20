{
  description = "PICC Flake";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.05";
  };

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        packages = with pkgs; [
          redis
          zlib
          nix-index
          dpkg
          cmake
          libmysqlclient

          python311
          python311Packages.black
          python311Packages.python-lsp-server
          python311Packages.pyflakes
          python311Packages.epc
          python311Packages.orjson
          python311Packages.sexpdata
          python311Packages.six
          python311Packages.setuptools
          python311Packages.paramiko
          python311Packages.rapidfuzz
          python311Packages.numpy
          python311Packages.mysqlclient
          python311Packages.watchdog
        ];

        shellHook = ''
          export LD_LIBRARY_PATH="/run/opengl-driver/lib:${pkgs.stdenv.cc.cc.lib}/lib:$LD_LIBRARY_PATH"
          if [ -d ".venv" ]; then
            source .venv/bin/activate
          fi
        '';
      };
    };
}
