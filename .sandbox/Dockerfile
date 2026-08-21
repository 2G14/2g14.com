# 2g14.com 用サンドボックス template。
# ビルドはホスト側で行われるため、サンドボックスのネットワークポリシーの影響を受けない。
FROM docker/sandbox-templates:claude-code-minimal

# git は mise レジストリに存在しないため apt で最新化する
USER root
RUN apt-get update && apt-get install -y --only-upgrade git && rm -rf /var/lib/apt/lists/*

USER agent

RUN curl -fsSL https://mise.run | sh

# latest はビルド時点で解決されイメージに固定される。更新はリビルドで行う
COPY --chown=agent:agent mise-config.toml /home/agent/.config/mise/config.toml

ENV PATH="/home/agent/.local/share/mise/shims:/home/agent/.local/bin:${PATH}"

RUN mise install && mise reshim

# 対話シェルでは shims ではなく activate を使う(mise の推奨)
RUN echo 'eval "$(mise activate bash)"' >> /home/agent/.bashrc
