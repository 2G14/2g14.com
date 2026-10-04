# claude の導入部分は docker/sandbox-kit-spec の examples/claude と同じ。
# ビルド時に入れる claude の版は yaml の version 引数で決める(実行中は自動更新される)。
FROM docker/sandbox-templates:claude-code-minimal
ARG CLAUDE_VERSION
ARG TARGETARCH
USER root
RUN case "$TARGETARCH" in \
      amd64) platform=linux-x64 ;; \
      arm64) platform=linux-arm64 ;; \
      *) echo "unsupported TARGETARCH: $TARGETARCH" >&2; exit 1 ;; \
    esac \
 && mkdir -p /home/agent/.local/share/claude/versions /home/agent/.local/bin \
 && curl -fsSL "https://downloads.claude.ai/claude-code-releases/${CLAUDE_VERSION}/${platform}/claude" \
      -o "/home/agent/.local/share/claude/versions/${CLAUDE_VERSION}" \
 && chmod 0755 "/home/agent/.local/share/claude/versions/${CLAUDE_VERSION}" \
 && ln -sfn "/home/agent/.local/share/claude/versions/${CLAUDE_VERSION}" /home/agent/.local/bin/claude \
 && chown -R agent:agent /home/agent/.local

# git は mise のレジストリに存在しないため apt で最新化する。
# ベースが apt で入れている gh は消す。残すと PATH 次第で mise の gh と入れ替わるため
RUN apt-get update && apt-get install -y --only-upgrade git && apt-get purge -y gh \
 && rm -rf /var/lib/apt/lists/*

USER agent
RUN curl -fsSL https://mise.run | sh
COPY --chown=agent:agent mise-config.toml /home/agent/.config/mise/config.toml
ENV PATH="/home/agent/.local/share/mise/shims:/home/agent/.local/bin:${PATH}"
RUN mise install && mise reshim
# 対話シェルでは shims ではなく activate を使う(mise の推奨)
RUN echo 'eval "$(mise activate bash)"' >> /home/agent/.bashrc

ENV IS_SANDBOX=1
WORKDIR /home/agent/workspace
ENTRYPOINT ["claude"]
# ベースの CMD は ["claude", "--dangerously-skip-permissions"]。ENTRYPOINT の設定で
# 暗黙に空になるが、YOLO を外すことがこの kit の目的なので明示的に空にする
CMD []
